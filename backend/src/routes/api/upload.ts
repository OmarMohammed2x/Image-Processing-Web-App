import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const setUpMulterStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../../../images'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  
});
// intialize the router
const uploadRouter = express.Router();

const upload = multer({ storage: setUpMulterStorage });
uploadRouter.post('/', upload.single('hello'), (req, res) => {
  try {
    const width = parseInt(req.query.width as string);
    const height = parseInt(req.query.height as string);

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      res.status(400).send('Invalid width or height. Both must be positive integers.');
      return;
    }
    res.send(`Your image is available at: http://localhost:3000/api/resizedImages?name=${encodeURIComponent(req.file?.originalname as string)}&width=${width}&height=${height}`);
    return;

  } catch (err) {
    res.status(500).send('An error occurred while processing the upload.');
  }
});

export default uploadRouter;
 