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

    // res.send(req.file)
    // res.send(`Your image is available at: http://localhost:3000/api/resizedImages?name=${encodeURIComponent(req.file?.filename as string)}&width=${width}&height=${height}`);
    res.status(200).send('Your image is successfully uploaded');
    return;

  } catch (err) {
    console.log(err)
    res.status(500).send('An error occurred while processing the upload.');
  }
});

export default uploadRouter;
 