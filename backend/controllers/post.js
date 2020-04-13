const mongoose=require("mongoose");
const Post = require("../models/post")


///Post Controller to create a post
exports.createPost = (req,res,next)=>{
  console.log("trying to upload image");
  const url = req.protocol + '://'+req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url+"/images/"+req.file.filename,
    creator: req.userData.userId
  });
  post.save()
  .then(response=>{
    res.status(201).json({
      message:" post added successfully",
      post: {
        id: response._id,
        title: response.title,
        content: response.content,
        imagePath: response.imagePath,
        creator: req.userData.userId
      }
    });
  })
  .catch(err=>{
    res.status(500).json({
      message:"Creating a post failed!"
    })
  });
}

///Post Controller to update a post
exports.updatePost = (req,res,next)=>{
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + '://'+req.get("host");
    imagePath = url+"/images/"+req.file.filename;
  }

  const post = new Post({
    _id: req.params.postId ,
    title: req.body.title,
    content:req.body.content,
    imagePath:imagePath,
    creator:req.userData.userId
  });
  console.log(post);
  Post.updateOne({ _id:req.params.postId,creator: req.userData.userId },post)
  .then((result)=>{
    console.log(result);
    if(result.n>0)
    {
      res.status(200).json({
        message:"post updated successfully"
      });
    }
    else{
      res.status(401).json({
        message:"Not Authorised"
      });
    }
  })
  .catch(err=>{
    res.status(500).json({
      message:"Couldn't Update post!"
    })
  })
}

///Post Controller to get a post
exports.getPost = (req,res,next)=>{

  Post.findById(req.params.postId)
  .then((post)=>{
    if(post){
      console.log("post found and sent");
      res.status(200).json({
        _id:post._id,
        title:post.title,
        content:post.content,
        imagePath:post.imagePath,
        creator:post.creator
      });
    }
    else{
      res.status(404).json({message: 'post not found'});
      console.log("post not found");
    }
  })
  .catch(err=>{
    res.status(500).json({
      message:"Post fetching failed!"
    })
  })
}

///Post Controller to get all posts
exports.getPosts = (req, res, next)=>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if(pageSize&&currentPage)
  {
    postQuery.skip(pageSize*(currentPage-1))
    .limit(pageSize);
  }
  postQuery
   .then(documents=>{
     fetchedPosts=documents;
    return Post.countDocuments();
    })
    .then((count)=>{
      return res.status(200).json({
        message: 'Posts fetched successfully',
        posts: fetchedPosts,
        maxPosts: count
    })
  })
  .catch(err=>{
    res.status(500).json({
      message: "Fetching posts failed!"
    })
  });
}

///Post Controller to delete a post
exports.deletePost = (req,res,next)=>{
  Post.deleteOne({_id:req.params.id,creator: req.userData.userId})
  .then((result)=>{
    console.log(result);
    if(result.deletedCount>0)
    {
      res.status(200).json({
        message:"post updated successfully"
      });
    }
    else{
      res.status(401).json({
        message:"Not Authorised"
      });
    }
  })
  .catch(err=>{
    res.status(500).json({
      message:"Deletion failed"
    })
  })
}
