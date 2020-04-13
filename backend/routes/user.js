const express = require("express");
const router = express.Router();
const userController = require('../controllers/user')

///POST request to create a user
router.post("/signup",userController.createUser)

///POST request for user login
router.post("/login",userController.userLogin)

module.exports=router;
