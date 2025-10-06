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

router.get("/", getNotes);
router.get("/:id", findNoteById);
router.post("/", upload.single("image"), createNote);
router.put("/:id",upload.single("image"), updateNote);
router.delete("/:id", deleteNote);

export default router;
