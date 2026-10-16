import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "GGMUsuniljakhar_super_secret_bookvault_jwt_key_2026";

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString().slice(11, 19)}] ${req.method} ${req.url}`);
    next();
  });
}

// Authentication Middleware
async function authenticateToken(req, res, next) {
  const token = req.headers.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });
    if (!user) {
      return res.status(401).json({ error: "User not found or session expired." });
    }
    req.user = user;
    req.username = user.username;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}

// Optional Auth (doesn't fail if no token)
async function optionalAuth(req, res, next) {
  const token = req.headers.token || req.headers.authorization?.replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { email: decoded.email },
      });
      if (user) {
        req.user = user;
        req.username = user.username;
      }
    } catch (e) {
      // ignore
    }
  }
  next();
}

// ==========================================
// 1. HEALTH & SYSTEM METRICS
// ==========================================
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    res.status(500).json({ status: "unhealthy", error: error.message });
  }
});

app.get("/api/stats", async (req, res) => {
  try {
    const totalBooks = await prisma.book.count();
    const activeRentals = await prisma.rental.count({
      where: { status: "ACTIVE" },
    });
    const totalUsers = await prisma.user.count();
    const rentals = await prisma.rental.findMany({
      select: { rental_fee: true, total_paid: true },
    });

    const totalRevenue = rentals.reduce((acc, r) => acc + (r.rental_fee || 0), 0);

    res.json({
      totalBooks,
      activeRentals,
      totalUsers,
      totalRevenue: Number(totalRevenue.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. AUTHENTICATION ROUTES
// (Compatible with both new /api/auth and legacy /signin, /signup, /me)
// ==========================================
async function handleSignup(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send("Please provide username, email and password");
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return res.status(400).send("User with this email or username already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        usertype: "user",
      },
    });

    const token = jwt.sign(
      { email: newUser.email, user_id: newUser.id, usertype: newUser.usertype },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "You've been signed up",
      token,
      user_id: newUser.id,
      username: newUser.username,
      usertype: newUser.usertype,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send("Error signing up: " + error.message);
  }
}

async function handleSignin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: email }],
      },
    });

    if (!foundUser) {
      return res.status(404).send("User not found");
    }

    // Check hashed password or plaintext fallback for legacy records
    let isMatch = false;
    if (foundUser.password.startsWith("$2a$") || foundUser.password.startsWith("$2b$")) {
      isMatch = await bcrypt.compare(password, foundUser.password);
    } else {
      isMatch = foundUser.password === password;
    }

    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign(
      { email: foundUser.email, user_id: foundUser.id, usertype: foundUser.usertype },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user_id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      usertype: foundUser.usertype,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).send("Error during signin: " + error.message);
  }
}

app.post("/signup", handleSignup);
app.post("/api/auth/signup", handleSignup);
app.post("/signin", handleSignin);
app.post("/api/auth/signin", handleSignin);

app.get("/me", authenticateToken, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    usertype: req.user.usertype,
  });
});
app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    usertype: req.user.usertype,
  });
});

// ==========================================
// 3. BOOK CATALOG & CATEGORIES
// ==========================================
app.get("/", async (req, res) => {
  try {
    const books = await prisma.book.findMany({ orderBy: { id: "asc" } });
    res.json(books);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/api/books", async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, availableOnly, sort } = req.query;

    const where = {};
    if (category && category !== "All") {
      where.category = { equals: category.toLowerCase().replace(/\s+/g, ""), mode: "insensitive" };
    }
    if (search) {
      where.OR = [
        { book_name: { contains: search, mode: "insensitive" } },
        { book_author: { contains: search, mode: "insensitive" } },
        { book_description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (availableOnly === "true") {
      where.available_copies = { gt: 0 };
    }
    if (minPrice || maxPrice) {
      where.price_per_day = {};
      if (minPrice) where.price_per_day.gte = parseFloat(minPrice);
      if (maxPrice) where.price_per_day.lte = parseFloat(maxPrice);
    }

    let orderBy = { id: "asc" };
    if (sort === "price-low") orderBy = { price_per_day: "asc" };
    if (sort === "price-high") orderBy = { price_per_day: "desc" };
    if (sort === "rating") orderBy = { star_ratings: "desc" };
    if (sort === "name") orderBy = { book_name: "asc" };

    const books = await prisma.book.findMany({ where, orderBy });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/books/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        reviews: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Legacy category endpoints for 100% frontend compatibility
app.get("/featuredbooks", async (req, res) => {
  try {
    const books = await prisma.book.findMany({ where: { is_featured: true } });
    res.json(books);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/fictionalbooks", async (req, res) => {
  try {
    const books = await prisma.book.findMany({ where: { category: "fictional" } });
    res.json(books);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/selfhelpbooks", async (req, res) => {
  try {
    const books = await prisma.book.findMany({ where: { category: "selfhelp" } });
    res.json(books);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/programmingbooks", async (req, res) => {
  try {
    const books = await prisma.book.findMany({ where: { category: "programming" } });
    res.json(books);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/inspiringbooks", async (req, res) => {
  try {
    const books = await prisma.book.findMany({ orderBy: { id: "asc" } });
    res.json(books);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/autobiographybooks", async (req, res) => {
  try {
    const books = await prisma.book.findMany({ where: { category: "autobiography" } });
    res.json(books);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/sportsbooks", async (req, res) => {
  try {
    const books = await prisma.book.findMany({ where: { category: "sports" } });
    res.json(books);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/authorinfo", async (req, res) => {
  try {
    const authors = await prisma.authorInfo.findMany();
    // Return format matching frontend INNER JOIN expectation
    const books = await prisma.book.findMany();
    const result = [];
    for (const author of authors) {
      const match = books.find((b) => b.book_author.toLowerCase() === author.author_name.toLowerCase());
      if (match) {
        result.push({
          book_name: match.book_name,
          author_image: author.author_image,
          author_name: author.author_name,
          category: match.category,
          book_image: match.book_image,
          book_description: match.book_description,
        });
      } else {
        result.push({
          book_name: "Featured Title",
          author_image: author.author_image,
          author_name: author.author_name,
          category: author.category || "General",
          book_image: author.author_image,
          book_description: author.author_bio || "Featured author at BookVault",
        });
      }
    }
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ==========================================
// 4. BOOK RENTAL SYSTEM (CORE FEATURE)
// ==========================================

// Estimate rental cost before renting
app.post("/api/rentals/calculate", (req, res) => {
  const { rentalDays = 14, dailyRate = 1.5, depositAmount = 15 } = req.body;
  const days = Math.max(1, Math.min(parseInt(rentalDays) || 14, 90));
  const rate = parseFloat(dailyRate) || 1.5;
  const deposit = parseFloat(depositAmount) || 15;

  const rentalFee = Number((days * rate).toFixed(2));
  const totalAmount = Number((rentalFee + deposit).toFixed(2));

  res.json({
    rentalDays: days,
    dailyRate: rate,
    depositAmount: deposit,
    rentalFee,
    totalAmount,
    refundableDeposit: deposit,
  });
});

// Modern & legacy rental creation
app.post("/borrowedbooks", async (req, res) => {
  try {
    const { selectedBook, user_id, returnVal, rentalDays = 14 } = req.body;

    if (!selectedBook || !user_id) {
      return res.status(400).send("Selected book and user_id are required.");
    }

    const userId = parseInt(user_id);
    const bookName = selectedBook.book_name?.toString();

    // Check if user already has this book actively rented
    const existingRental = await prisma.rental.findFirst({
      where: {
        user_id: userId,
        book_name: bookName,
        status: "ACTIVE",
      },
    });

    if (existingRental) {
      return res.send("The Book Is Already Borrowed");
    }

    // Find the book in db
    let book = null;
    if (selectedBook.id || selectedBook.book_id) {
      book = await prisma.book.findUnique({
        where: { id: parseInt(selectedBook.id || selectedBook.book_id) },
      });
    }
    if (!book) {
      book = await prisma.book.findFirst({ where: { book_name: bookName } });
    }

    // Availability check
    if (book && book.available_copies <= 0) {
      return res.status(400).send("No copies currently available for rent.");
    }

    const dailyRate = book?.price_per_day || 1.50;
    const deposit = book?.deposit_amount || 15.00;
    const days = parseInt(rentalDays) || 14;
    const rentalFee = Number((days * dailyRate).toFixed(2));
    const totalPaid = Number((rentalFee + deposit).toFixed(2));

    const startDate = new Date();
    let dueDate = new Date();
    if (returnVal) {
      dueDate = new Date(returnVal);
    } else {
      dueDate.setDate(dueDate.getDate() + days);
    }

    const newRental = await prisma.rental.create({
      data: {
        user_id: userId,
        book_id: book ? book.id : (selectedBook.book_id || 1),
        book_name: bookName,
        book_author: selectedBook.book_author?.toString() || "Unknown Author",
        book_image: selectedBook.book_image?.toString() || "",
        book_description: selectedBook.book_description?.toString() || "",
        start_date: startDate,
        due_date: dueDate,
        returnon: returnVal ? returnVal.toString() : dueDate.toISOString().split("T")[0],
        rental_days: days,
        daily_rate: dailyRate,
        deposit_amount: deposit,
        rental_fee: rentalFee,
        total_paid: totalPaid,
        refund_amount: deposit,
        status: "ACTIVE",
      },
    });

    // Decrement available copies if book found
    if (book && book.available_copies > 0) {
      await prisma.book.update({
        where: { id: book.id },
        data: {
          available_copies: { decrement: 1 },
          is_available: book.available_copies - 1 > 0,
        },
      });
    }

    res.send("Book Borrowed Successfully!");
  } catch (error) {
    console.error("Borrow error:", error);
    res.status(500).send("Error renting book: " + error.message);
  }
});

// Modern API endpoint for renting
app.post("/api/rentals/rent", async (req, res) => {
  try {
    const { bookId, userId, rentalDays = 14, returnDate } = req.body;
    const bId = parseInt(bookId);
    const uId = parseInt(userId);

    const book = await prisma.book.findUnique({ where: { id: bId } });
    if (!book) return res.status(404).json({ error: "Book not found" });

    if (book.available_copies <= 0) {
      return res.status(400).json({ error: "No copies currently available for rent" });
    }

    const existingActive = await prisma.rental.findFirst({
      where: { book_id: bId, user_id: uId, status: "ACTIVE" },
    });
    if (existingActive) {
      return res.status(400).json({ error: "You already have an active rental for this book" });
    }

    const days = parseInt(rentalDays) || 14;
    const startDate = new Date();
    const dueDate = returnDate ? new Date(returnDate) : new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const rentalFee = Number((days * book.price_per_day).toFixed(2));
    const totalPaid = Number((rentalFee + book.deposit_amount).toFixed(2));

    const rental = await prisma.rental.create({
      data: {
        user_id: uId,
        book_id: bId,
        book_name: book.book_name,
        book_author: book.book_author,
        book_image: book.book_image,
        book_description: book.book_description,
        start_date: startDate,
        due_date: dueDate,
        returnon: dueDate.toISOString().split("T")[0],
        rental_days: days,
        daily_rate: book.price_per_day,
        deposit_amount: book.deposit_amount,
        rental_fee: rentalFee,
        total_paid: totalPaid,
        refund_amount: book.deposit_amount,
        status: "ACTIVE",
      },
    });

    await prisma.book.update({
      where: { id: bId },
      data: {
        available_copies: { decrement: 1 },
        is_available: book.available_copies - 1 > 0,
      },
    });

    res.json({
      message: "Book rented successfully!",
      rental,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's active & past borrowed books
app.post("/getborrowedbooks", async (req, res) => {
  const user_id = parseInt(req.body.user_id);
  if (!user_id || isNaN(user_id)) {
    return res.json([]);
  }

  try {
    const rentals = await prisma.rental.findMany({
      where: { user_id, status: "ACTIVE" },
      orderBy: { id: "desc" },
    });

    // Compute remaining days and overdue status
    const enriched = rentals.map((r) => {
      const now = new Date();
      const due = new Date(r.due_date || r.returnon);
      const diffMs = due - now;
      const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return {
        ...r,
        book_id: r.book_id,
        days_remaining: daysRemaining,
        is_overdue: daysRemaining < 0,
      };
    });

    res.json(enriched);
  } catch (error) {
    console.error("Get borrowed books error:", error);
    res.json([]);
  }
});

app.get("/api/rentals/my-rentals", authenticateToken, async (req, res) => {
  try {
    const rentals = await prisma.rental.findMany({
      where: { user_id: req.user.id },
      include: { book: true },
      orderBy: { createdAt: "desc" },
    });

    const enriched = rentals.map((r) => {
      const now = new Date();
      const due = new Date(r.due_date || r.returnon);
      const diffMs = due - now;
      const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return {
        ...r,
        days_remaining: daysRemaining,
        is_overdue: r.status === "ACTIVE" && daysRemaining < 0,
      };
    });

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/totalborrowedbooks", async (req, res) => {
  try {
    const rentals = await prisma.rental.findMany({
      where: { status: "ACTIVE" },
      orderBy: { id: "desc" },
    });
    res.json(rentals);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Return rented book (Refund deposit, restore copy)
app.post("/removefromborrowedbooks", async (req, res) => {
  const { book_id, user_id, rental_id } = req.body;
  try {
    let rental = null;
    if (rental_id) {
      rental = await prisma.rental.findUnique({ where: { id: parseInt(rental_id) } });
    } else if (book_id && user_id) {
      rental = await prisma.rental.findFirst({
        where: {
          book_id: parseInt(book_id),
          user_id: parseInt(user_id),
          status: "ACTIVE",
        },
      });
    }

    if (!rental) {
      return res.status(404).send("Rental record not found.");
    }

    // Mark as RETURNED with timestamp
    await prisma.rental.update({
      where: { id: rental.id },
      data: {
        status: "RETURNED",
        returned_at: new Date(),
      },
    });

    // Increment available book copies
    await prisma.book.update({
      where: { id: rental.book_id },
      data: {
        available_copies: { increment: 1 },
        is_available: true,
      },
    });

    res.send(`Book Returned Successfully! Security deposit ($${rental.deposit_amount}) refunded.`);
  } catch (error) {
    console.error("Return book error:", error);
    res.status(500).send("Error returning book: " + error.message);
  }
});

// ==========================================
// 5. REVIEWS, RATINGS & FAVORITES
// ==========================================
app.get("/getreviews", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { id: "desc" },
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/reviews", async (req, res) => {
  const { book_id, review_headline, review_description, username } = req.body;
  try {
    const bId = parseInt(book_id);
    const existing = await prisma.review.findFirst({
      where: { book_id: bId, username: username },
    });

    if (existing) {
      return res.send("User can only write one book review for a particular book");
    }

    await prisma.review.create({
      data: {
        book_id: bId,
        review_headline,
        review_description,
        username,
      },
    });

    res.send("Review added successfully");
  } catch (error) {
    res.send("User can only write one book review for a particular book");
  }
});

app.post("/ratinginfo", async (req, res) => {
  const { rating, book_name } = req.body;
  try {
    await prisma.book.updateMany({
      where: { book_name },
      data: { star_ratings: parseFloat(rating) },
    });
    res.send("Rating updated");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/favoriteinfo", async (req, res) => {
  const { isFavorite, bookName } = req.body;
  try {
    await prisma.book.updateMany({
      where: { book_name: bookName },
      data: { isfavourite: isFavorite === "true" || isFavorite === true },
    });
    res.send("Favorite status updated");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/getfavoritebooks", async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      where: { isfavourite: true },
    });
    res.json(books);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ==========================================
// 6. ADMIN & USER MANAGEMENT
// ==========================================
app.get("/getuserinfo", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        usertype: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/admin-userinfo", async (req, res) => {
  try {
    const rentals = await prisma.rental.findMany({
      where: { status: "ACTIVE" },
      include: {
        user: { select: { username: true, id: true } },
      },
    });

    const result = rentals.map((r) => ({
      username: r.user.username,
      book_id: r.book_id,
      book_name: r.book_name,
      book_author: r.book_author,
      book_image: r.book_image,
      book_description: r.book_description,
      user_id: r.user_id,
      returnon: r.returnon,
      rental_fee: r.rental_fee,
      deposit_amount: r.deposit_amount,
      daily_rate: r.daily_rate,
      status: r.status,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/addbooks", async (req, res) => {
  try {
    const {
      book_name,
      book_author,
      book_image,
      book_description,
      category,
      price_per_day = 1.50,
      deposit_amount = 15.00,
      total_copies = 5,
    } = req.body;

    const newBook = await prisma.book.create({
      data: {
        book_name,
        book_author,
        book_image,
        book_description,
        category: category.toLowerCase().replace(/\s+/g, ""),
        price_per_day: parseFloat(price_per_day) || 1.50,
        deposit_amount: parseFloat(deposit_amount) || 15.00,
        total_copies: parseInt(total_copies) || 5,
        available_copies: parseInt(total_copies) || 5,
        star_ratings: 4.5,
        is_available: true,
      },
    });

    res.json(newBook);
  } catch (error) {
    res.status(500).send("Error adding book: " + error.message);
  }
});

// ==========================================
// 7. PRODUCTION STATIC FILE SERVING
// (Allows full deployment as single server)
const clientDistPath = fs.existsSync(path.resolve(__dirname, "../../BookVault-Frontend/dist"))
  ? path.resolve(__dirname, "../../BookVault-Frontend/dist")
  : path.resolve(__dirname, "../../Frontend/dist");
if (fs.existsSync(clientDistPath)) {
  console.log(`📦 Serving static client build from ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.get("*", (req, res) => {
    // If API route not found, 404
    if (req.url.startsWith("/api/")) {
      return res.status(404).json({ error: "Endpoint not found" });
    }
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, closing Prisma Client...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, closing Prisma Client...");
  await prisma.$disconnect();
  process.exit(0);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 BookVault Unified Server running on http://localhost:${PORT}`);
  console.log(`📚 Connected via Prisma ORM to PostgreSQL`);
  console.log(`🔑 Auth & Rental APIs enabled`);
});

export default app;
