import Post from "../model/Post.js";

export async function getAllPosts(req, res) {
  try {
    const { category, author } = req.query;
    let query = {};

    if (category) {
      query.category = category.toUpperCase();
    }

    if (author) {
      query.author = author;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate('author', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(posts);
  } catch (error) {
    console.error("Get all posts error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createPost(req, res) {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }
    const newPost = new Post({
      title,
      content,
      author: req.userId,
      category: category?.toUpperCase() || "GENERAL",
    });
    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updatePost(req, res) {
  try {
    const { title, content, category } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }
    post.title = title;
    post.content = content;
    post.category = category?.toUpperCase() || "GENERAL";
    await post.save();
    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSinglePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Get single post error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
