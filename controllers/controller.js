import Note from "../model/note.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const getNotes = asyncHandler(async (_req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, "Notes fetched successfully", notes));
});

const findNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    throw new ApiError(404, "Note not found");
  }
  res.status(200).json(new ApiResponse(200, "Note fetched successfully", note));
});

const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const path = req.file?.buffer;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  const { secure_url, public_id } = path
    ? await uploadOnCloudinary(path)
    : { secure_url: null, public_id: null };

  const newNote = await Note.create({
    title,
    content,
    image: {
      secure_url,
      public_id,
    },
  });

  res.status(201).json(new ApiResponse(201, "Note created successfully", newNote));
});

const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Note id is required");
  }

  const note = await Note.findById(id);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  // Cloudinary delete, crash-safe
  if (note.image.public_id) {
    try {
      const response = await deleteFromCloudinary(note.image.public_id);
      console.log("Cloudinary deletion response:", response);
    } catch (err) {
      console.error("Cloudinary deletion failed:", err);
    }
  }

  await Note.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, "Note deleted successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const path = req.file?.buffer;

  if (!id) throw new ApiError(400, "Note id is required");
  if (!title || !content) throw new ApiError(400, "Title and content are required");

  const note = await Note.findById(id);
  if (!note) throw new ApiError(404, "Note not found");

  // ✅ Initialize with existing image data
  let secure_url = note.image?.secure_url || null;
  let public_id = note.image?.public_id || null;

  // ✅ If new image is uploaded
  if (path) {
    if (public_id) {
      await deleteFromCloudinary(public_id);
    }

    const uploadResult = await uploadOnCloudinary(path);
    secure_url = uploadResult.secure_url;
    public_id = uploadResult.public_id;
  }

  const updatedNote = await Note.findByIdAndUpdate(
    id,
    {
      title,
      content,
      image: { secure_url, public_id },
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Note updated successfully", updatedNote));
});

export { getNotes, createNote, updateNote, deleteNote, findNoteById };
