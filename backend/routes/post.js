const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

///Post request to create a post
router.post("",checkAuth,extractFile
  ,postController.createPost);

 ///PUT request to update a post
router.put("/:postId",checkAuth,
  extractFile,postController.updatePost);

///GET request to get a single post
router.get("/:postId",postController.getPost)

///GET request to get all posts
router.get("",postController.getPosts);

///DELETE request to delete a post
router.delete("/:id",checkAuth, postController.deletePost)


module.exports=router;
