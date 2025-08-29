import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  findNoteById,
} from "../controllers/controller.js";

const router = express.Router();

router.get("/all", getNotes);
router.get("/find/:id", findNoteById);
router.post("/add", upload.single("image"), createNote);
router.put("/update/:id",upload.single("image"), updateNote);
router.delete("/delete/:id", deleteNote);

export default router;
