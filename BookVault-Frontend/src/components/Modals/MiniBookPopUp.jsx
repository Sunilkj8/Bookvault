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

export default function MiniBookPopUp({ selectedBook }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <div>
      <button
        onClick={handleOpen}
        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 transition duration-150 shadow-sm flex items-center gap-1.5"
      >
        <span>Rent</span>
        <span className="text-[10px] text-emerald-400 font-mono">
          ${(selectedBook?.price_per_day || 1.50).toFixed(2)}/d
        </span>
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="mini-rental-modal-title"
        aria-describedby="mini-rental-modal-description"
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
