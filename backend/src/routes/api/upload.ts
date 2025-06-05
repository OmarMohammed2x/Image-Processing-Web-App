import express from 'express';
import multer from 'multer';
import path from 'path';
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
uploadRouter.post('/', upload.single('image'), (req, res) => {
  try {
    res.status(200).json(req.file);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send('An error occurred while processing the upload.');
  }
});

export default uploadRouter;
