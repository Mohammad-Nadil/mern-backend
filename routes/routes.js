import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  findNoteById,
  personalNotes,
} from "../controllers/note.controller.js";
import {
  allUsers,
  getUser,
  login,
  logout,
  refreshAccessToken,
  signup,
} from "../controllers/user.controller.js";
import { jwt_verify } from "../middleware/Auth.middleware.js";

const router = express.Router();

// user routes
router.get("/allUsers", allUsers);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", jwt_verify, logout);
router.post("/refreshToken", refreshAccessToken);
router.get("/user", jwt_verify, getUser);

// public routes
router.get("/", getNotes);

// secure routes

router.use(jwt_verify);

router.get("/my-notes", personalNotes);
router.post("/", upload.single("image"), createNote);
router.get("/:id", findNoteById);
router.put("/:id", upload.single("image"), updateNote);
router.delete("/:id", deleteNote);

export default router;
