const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post')
const mongoose=require("mongoose");
const app = express();
const path = require("path");
const postsRoutes = require ("./routes/post")
const userRoutes = require ("./routes/user")

///Connecting to the MongoDB cloud database
mongoose.connect("mongodb+srv://max:"+process.env.MONGO_ATLAS_PW+"@cluster0-netkn.gcp.mongodb.net/node-angular?retryWrites=true&w=majority",
{ useNewUrlParser: true,
  useUnifiedTopology: true}
)
.then(()=>{
  console.log("mongoose is connected successfully");
})
.catch(()=>{
  console.log('Connection failed');
})

///Body parser middleware
//NOTE: to extract the entire body portion of an incoming request stream and exposes it on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

///Express-Static Middleware
//NOTE:To serve static files such as images, CSS files, and JavaScript files
app.use("/images",express.static(path.join("backend/images")));


///CORS
//NOTE: Additional http headers to tell browsers to give a web application running at one origin,
// access to selected resources from a different origin.
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin,X-Requested-With,Content-Type,Accept,Authorization");
  res.setHeader("Access-Control-Allow-Methods",
  "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  next();
})

///Post Routes
app.use("/api/posts",postsRoutes);

///User Routes
app.use("/api/user",userRoutes);

module.exports = app;
