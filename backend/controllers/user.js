const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var User = require ("../models/user")


///User Controller to create a user
exports.createUser = (req,res,next)=>{
  bcrypt.hash(req.body.password,10)
  .then(hash=>{
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
    .then(result=>{
      res.status(201).json({
        message:"user created",
        result:result
      })
    })
    .catch(err=>{
      res.status(500).json({
        message:"Invalid Authentication Credentials!"
      })
    })
  })
}

///User Controller to login a user
exports.userLogin = (req,res,next)=>{
  let fetchedUser;

  console.log(req.body.email);
  User.findOne({email:req.body.email})
  .then(user=>{
    console.log(user);
    fetchedUser=user;
    if(!user){
      console.login("error here");
      return res.status(401).json({
        message: "Invalid Authentication Credentials!"
      });
    }
    return bcrypt.compare(req.body.password,user.password);
  })
  .then(result=>{
    console.log(result);
    if(!result){
      res.status(401).json({
        message:"Invalid User Credentials!"
      });
    }
    const token = jwt.sign( {email: fetchedUser.email, userId: fetchedUser._id },
      process.env.JWT_KEY,
      {expiresIn: "1h"}
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId:fetchedUser._id
      })
  })
  .catch(err=>{
    console.log(err);
    res.status(401).json({
      message:"Invalid User Credentials!"
    });
  })
}
