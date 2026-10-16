import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import BorrowBookPopUp from "../BooksPage/fictionalBooksComponents/BorrowBookPopUp";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 540,
  maxHeight: "90vh",
  overflowY: "auto",
  outline: "none",
  p: 0,
};

export default function BookPopUp({ selectedBook }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const pricePerDay = selectedBook?.price_per_day || 1.50;

  return (
    <div>
      <button
        onClick={handleOpen}
        className="bg-black hover:bg-neutral-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 text-base active:scale-95"
      >
        <span>Rent Book</span>
        <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
          ${pricePerDay.toFixed(2)}/day
        </span>
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="rental-modal-title"
        aria-describedby="rental-modal-description"
      >
        <Box sx={modalStyle}>
          <BorrowBookPopUp
            selectedBook={selectedBook}
            setBorrowBookPopUp={setOpen}
            onSuccess={handleClose}
          />
        </Box>
      </Modal>
    </div>
  );
}
