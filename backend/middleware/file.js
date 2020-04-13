const multer = require ("multer");

///MIME_TYPE_MAP to get the mime type
const MIME_TYPE_MAP ={
  'image/png':'png',
  'image/jpg':'jpg',
  'image/jpeg':'png'
};


///MULTER middleware to extract image and store it in server
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    console.log("*** multer is running***");
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid)
    {
      error = null;
    }

    cb(error, "backend/images");
  },
  filename:(req,file,cb)=>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null,name + '-' + Date.now() + '.' + ext);
  }
});

module.exports = multer({storage: storage}).single("image");
