/* const express = require("express");
const router = express.Router();

// Import the necessary controllers
const postController = require("./controllers/postController");
const commentController = require("./controllers/commentController");
const likeController = require("./controllers/likeController");

// Define the REST endpoints
router.get("/posts", postController.getAllPosts);
router.get("/posts/:postId", postController.getPostById);
router.post("/posts", postController.createPost);
router.delete("/posts/:postId", postController.deletePost);

router.post("/posts/:postId/comments", commentController.createComment);
router.delete(
  "/posts/:postId/comments/:commentId",
  commentController.deleteComment
);

router.post("/posts/:postId/like", likeController.likePost);
router.delete("/posts/:postId/like", likeController.unlikePost);

module.exports = router;
 */
