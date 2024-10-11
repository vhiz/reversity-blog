import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getSinglePost,
  updatePost,
} from "../controllers/postController.js";
const router = express.Router();

//get all post
router.get("/", getAllPosts);

//get single post
router.get("/:id", getSinglePost);

//create posts
router.post("/", createPost);

//delete post
router.delete("/:id", deletePost);

// update post
router.put("/:id", updatePost);

export default router;
