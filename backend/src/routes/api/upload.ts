import express from 'express';
import multer from 'multer';
import path from 'path';
const setUpMulterStorage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,path.resolve(__dirname,'../../../images'))
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname);
  }
})
const uploadRouter= express.Router();

const upload = multer({storage:setUpMulterStorage});
uploadRouter.post('/', upload.single('hello'),(req, res) => {
  try {
    res.json({ message: 'image successfuly uploaded', file: req.file });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Image upload failed' });
  }
})

export default uploadRouter;
