import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting BookVault database seeding...");

  // Clean existing tables (in proper order for foreign keys)
  await prisma.review.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.rental.deleteMany({});
  await prisma.book.deleteMany({});
  await prisma.authorInfo.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🧹 Cleaned existing records");

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const userPassword = await bcrypt.hash("user123", salt);
  const adminPassword = await bcrypt.hash("admin123", salt);

  // 1. Create Users
  const user1 = await prisma.user.create({
    data: {
      username: "suniljakhar",
      email: "sunil@bookvault.com",
      password: userPassword,
      usertype: "user",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
  });

  const admin = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@bookvault.com",
      password: adminPassword,
      usertype: "admin",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "elena_reads",
      email: "elena@example.com",
      password: userPassword,
      usertype: "user",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    },
  });

  console.log(`👤 Created ${await prisma.user.count()} users`);

  // 2. Create Books with Rental Rates & Deposits
  const booksData = [
    // Programming
    {
      book_name: "Clean Code: A Handbook of Agile Software Craftsmanship",
      book_author: "Robert C. Martin",
      book_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436202607i/3735293.jpg",
      book_description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. This book is a must-read for any developer wanting to produce readable, professional code.",
      category: "programming",
      star_ratings: 4.8,
      price_per_day: 1.50,
      deposit_amount: 18.00,
      total_copies: 6,
      available_copies: 4,
      is_available: true,
      isfavourite: true,
      is_featured: true,
      published_year: 2008,
    },
    {
      book_name: "The Pragmatic Programmer: Your Journey To Mastery",
      book_author: "David Thomas, Andrew Hunt",
      book_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1568544997i/48855.jpg",
      book_description: "Straight from the programming trenches, The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process: taking a requirement and producing working, maintainable code.",
      category: "programming",
      star_ratings: 4.9,
      price_per_day: 1.75,
      deposit_amount: 20.00,
      total_copies: 5,
      available_copies: 5,
      is_available: true,
      isfavourite: true,
      is_featured: true,
      published_year: 2019,
    },
    {
      book_name: "Designing Data-Intensive Applications",
      book_author: "Martin Kleppmann",
      book_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1460592976i/23463279.jpg",
      book_description: "Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability. This book helps you navigate the diverse and fast-changing landscape of technologies.",
      category: "programming",
      star_ratings: 5.0,
      price_per_day: 2.20,
      deposit_amount: 25.00,
      total_copies: 4,
      available_copies: 3,
      is_available: true,
      isfavourite: true,
      is_featured: true,
      published_year: 2017,
    },
    {
      book_name: "Eloquent JavaScript: A Modern Introduction",
      book_author: "Marijn Haverbeke",
      book_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1307226105i/8910666.jpg",
      book_description: "JavaScript lies at the heart of almost every modern web application. Eloquent JavaScript dives deep into the JavaScript language to show you how to write beautiful, effective code.",
      category: "programming",
      star_ratings: 4.6,
      price_per_day: 1.25,
      deposit_amount: 15.00,
      total_copies: 7,
      available_copies: 6,
      is_available: true,
      isfavourite: false,
      is_featured: false,
      published_year: 2018,
    },

    // Self-Help
    {
      book_name: "Atomic Habits",
      book_author: "James Clear",
      book_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
      book_description: "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master tiny behaviors that lead to remarkable results.",
      category: "selfhelp",
      star_ratings: 4.9,
      price_per_day: 1.50,
      deposit_amount: 15.00,
      total_copies: 10,
      available_copies: 7,
      is_available: true,
      isfavourite: true,
      is_featured: true,
      published_year: 2018,
    },
    {
      book_name: "The Psychology of Money",
      book_author: "Morgan Housel",
      book_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1581527774i/41881472.jpg",
      book_description: "Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people. Morgan Housel shares 19 short stories exploring the strange ways people think about money.",
      category: "selfhelp",
      star_ratings: 4.8,
      price_per_day: 1.40,
      deposit_amount: 14.00,
      total_copies: 8,
      available_copies: 6,
      is_available: true,
      isfavourite: true,
      is_featured: true,
      published_year: 2020,
    },
    {
      book_name: "Deep Work: Rules for Focused Success in a Distracted World",
      book_author: "Cal Newport",
      book_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1447957962i/25744928.jpg",
      book_description: "Deep work is the ability to focus without distraction on a cognitively demanding task. It's a skill that allows you to quickly master complicated information and produce better results in less time.",
      category: "selfhelp",
      star_ratings: 4.7,
      price_per_day: 1.30,
      deposit_amount: 15.00,
      total_copies: 6,
      available_copies: 4,
      is_available: true,
      isfavourite: false,
      is_featured: false,
      published_year: 2016,
    },
    {
      book_name: "Can't Hurt Me: Master Your Mind and Defy the Odds",
      book_author: "David Goggins",
      book_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1531868984i/40380598.jpg",
      book_description: "For David Goggins, childhood was a nightmare - poverty, prejudice, and physical abuse colored his days and haunted his nights. But through self-discipline, mental toughness, and hard work, Goggins transformed himself from a depressed, overweight young man into a U.S. Armed Forces icon.",
      category: "selfhelp",
      star_ratings: 4.9,
      price_per_day: 1.60,
      deposit_amount: 16.00,
      total_copies: 8,
      available_copies: 5,
      is_available: true,
      isfavourite: true,
      is_featured: true,
      published_year: 2018,
    },

    // Fiction
    {
      book_name: "The Midnight Library",
      book_author: "Matt Haig",
      book_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg",
      book_description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things'd be if you had made other choices.",
      category: "fictional",
      star_ratings: 4.5,
      price_per_day: 1.20,
      deposit_amount: 12.00,
      total_copies: 8,
      available_copies: 6,
      is_available: true,
      isfavourite: true,
      is_featured: true,
      published_year: 2020,
    },
    {
      book_name: "Dune",
      book_author: "Frank Herbert",
      book_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg",
      book_description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange, a drug capable of extending life and enhancing consciousness.",
      category: "fictional",
      star_ratings: 4.8,
      price_per_day: 1.50,
      deposit_amount: 16.00,
      total_copies: 6,
      available_copies: 4,
      is_available: true,
      isfavourite: false,
      is_featured: true,
      published_year: 1965,
    },
    {
      book_name: "Project Hail Mary",
      book_author: "Andy Weir",
      book_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg",
      book_description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself are doomed. Except right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it.",
      category: "fictional",
      star_ratings: 4.9,
      price_per_day: 1.70,
      deposit_amount: 18.00,
      total_copies: 5,
      available_copies: 5,
      is_available: true,
      isfavourite: true,
      is_featured: true,
      published_year: 2021,
    },

    // Autobiography
    {
      book_name: "Steve Jobs",
      book_author: "Walter Isaacson",
      book_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1511288482i/11084145.jpg",
      book_description: "Based on more than forty interviews with Steve Jobs conducted over two years—as well as interviews with more than a hundred family members, friends, adversaries, competitors, and colleagues—Walter Isaacson has written a riveting story of the roller-coaster life and searingly intense personality of a creative entrepreneur.",
      category: "autobiography",
      star_ratings: 4.7,
      price_per_day: 1.50,
      deposit_amount: 18.00,
      total_copies: 6,
      available_copies: 5,
      is_available: true,
      isfavourite: true,
      is_featured: true,
      published_year: 2011,
    },
    {
      book_name: "Shoe Dog: A Memoir by the Creator of Nike",
      book_author: "Phil Knight",
      book_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1457284880i/27220736.jpg",
      book_description: "In this candid and riveting memoir, for the first time ever, Nike founder and CEO Phil Knight shares the inside story of the company’s early days as an intrepid start-up and its evolution into one of the world’s most iconic, game-changing, and profitable brands.",
      category: "autobiography",
      star_ratings: 4.8,
      price_per_day: 1.60,
      deposit_amount: 16.00,
      total_copies: 7,
      available_copies: 6,
      is_available: true,
      isfavourite: true,
      is_featured: true,
      published_year: 2016,
    },
    {
      book_name: "Becoming",
      book_author: "Michelle Obama",
      book_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1528206996i/38746485.jpg",
      book_description: "In a life filled with meaning and accomplishment, Michelle Obama has emerged as one of the most iconic and compelling women of our era. A work of deep reflection and mesmerizing storytelling, Becoming invites readers into her world.",
      category: "autobiography",
      star_ratings: 4.6,
      price_per_day: 1.40,
      deposit_amount: 15.00,
      total_copies: 5,
      available_copies: 4,
      is_available: true,
      isfavourite: false,
      is_featured: false,
      published_year: 2018,
    },

    // Sports
    {
      book_name: "The Mamba Mentality: How I Play",
      book_author: "Kobe Bryant",
      book_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1540321288i/39296041.jpg",
      book_description: "In the wake of his retirement from professional basketball, Kobe “The Black Mamba” Bryant decided to share his vast knowledge and understanding of the game to take readers on an unprecedented journey to the core of the legendary “Mamba mentality.”",
      category: "sports",
      star_ratings: 4.8,
      price_per_day: 1.50,
      deposit_amount: 18.00,
      total_copies: 6,
      available_copies: 5,
      is_available: true,
      isfavourite: true,
      is_featured: true,
      published_year: 2018,
    },
    {
      book_name: "Relentless: From Good to Great to Unstoppable",
      book_author: "Tim S. Grover",
      book_image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1360098488i/17214460.jpg",
      book_description: "For more than two decades, legendary trainer Tim Grover has taken the greats—Michael Jordan, Kobe Bryant, Dwyane Wade, and dozens more—and made them greater. Now, for the first time in paperback, he reveals what it takes to get those results.",
      category: "sports",
      star_ratings: 4.7,
      price_per_day: 1.40,
      deposit_amount: 15.00,
      total_copies: 5,
      available_copies: 5,
      is_available: true,
      isfavourite: false,
      is_featured: false,
      published_year: 2013,
    },
  ];

  for (const b of booksData) {
    await prisma.book.create({ data: b });
  }

  console.log(`📚 Created ${await prisma.book.count()} books`);

  // 3. Create Authors for AuthorCarousel
  const authorsData = [
    {
      author_name: "Robert C. Martin",
      author_image: "https://images.gr-assets.com/authors/1490470709p8/45372.jpg",
      category: "programming",
      author_bio: "Uncle Bob Martin is a software engineer, author, and co-author of the Agile Manifesto.",
    },
    {
      author_name: "James Clear",
      author_image: "https://images.gr-assets.com/authors/1539207010p8/7327369.jpg",
      category: "selfhelp",
      author_bio: "James Clear is a writer and speaker focused on habits, decision making, and continuous improvement.",
    },
    {
      author_name: "Morgan Housel",
      author_image: "https://images.gr-assets.com/authors/1598031388p8/6474136.jpg",
      category: "selfhelp",
      author_bio: "Morgan Housel is a partner at The Collaborative Fund and a former columnist at The Wall Street Journal.",
    },
    {
      author_name: "Walter Isaacson",
      author_image: "https://images.gr-assets.com/authors/1247076899p8/7111.jpg",
      category: "autobiography",
      author_bio: "Walter Isaacson is an American author, journalist, and professor who has written acclaimed biographies.",
    },
    {
      author_name: "Andy Weir",
      author_image: "https://images.gr-assets.com/authors/1400877995p8/6540057.jpg",
      category: "fictional",
      author_bio: "Andy Weir is an American novelist best known for his space science fiction bestseller The Martian.",
    },
  ];

  for (const a of authorsData) {
    await prisma.authorInfo.create({ data: a });
  }

  // 4. Create Sample Active Rentals for user1
  const cleanCode = await prisma.book.findFirst({ where: { book_name: { contains: "Clean Code" } } });
  const atomicHabits = await prisma.book.findFirst({ where: { book_name: { contains: "Atomic Habits" } } });

  const now = new Date();
  const returnDate1 = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000); // 12 days left
  const returnDate2 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);  // 5 days left

  if (cleanCode) {
    await prisma.rental.create({
      data: {
        user_id: user1.id,
        book_id: cleanCode.id,
        book_name: cleanCode.book_name,
        book_author: cleanCode.book_author,
        book_image: cleanCode.book_image,
        book_description: cleanCode.book_description,
        start_date: now,
        returnon: returnDate1.toISOString().split("T")[0],
        due_date: returnDate1,
        rental_days: 14,
        daily_rate: cleanCode.price_per_day,
        deposit_amount: cleanCode.deposit_amount,
        rental_fee: 14 * cleanCode.price_per_day,
        total_paid: 14 * cleanCode.price_per_day + cleanCode.deposit_amount,
        refund_amount: cleanCode.deposit_amount,
        status: "ACTIVE",
      },
    });
  }

  if (atomicHabits) {
    await prisma.rental.create({
      data: {
        user_id: user1.id,
        book_id: atomicHabits.id,
        book_name: atomicHabits.book_name,
        book_author: atomicHabits.book_author,
        book_image: atomicHabits.book_image,
        book_description: atomicHabits.book_description,
        start_date: now,
        returnon: returnDate2.toISOString().split("T")[0],
        due_date: returnDate2,
        rental_days: 7,
        daily_rate: atomicHabits.price_per_day,
        deposit_amount: atomicHabits.deposit_amount,
        rental_fee: 7 * atomicHabits.price_per_day,
        total_paid: 7 * atomicHabits.price_per_day + atomicHabits.deposit_amount,
        refund_amount: atomicHabits.deposit_amount,
        status: "ACTIVE",
      },
    });
  }

  // 5. Create Sample Reviews
  if (cleanCode) {
    await prisma.review.create({
      data: {
        book_id: cleanCode.id,
        username: "elena_reads",
        review_headline: "Transformed my coding style completely!",
        review_description: "Rented this book for two weeks and it completely changed how I think about naming, function sizes, and unit testing. Best rental ever!",
        rating: 5,
      },
    });
  }

  if (atomicHabits) {
    await prisma.review.create({
      data: {
        book_id: atomicHabits.id,
        username: "suniljakhar",
        review_headline: "Practical and life-changing",
        review_description: "The 1% better every day rule is something I now apply to everything. Super quick delivery and the rental period was plenty to finish.",
        rating: 5,
      },
    });
  }

  console.log("✨ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
