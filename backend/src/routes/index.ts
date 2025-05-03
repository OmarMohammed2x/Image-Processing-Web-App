import express from 'express';
import uploadRouter from './api/upload';
import resizedImages from './api/resizedImages';

const router = express.Router();

router.use('/upload', uploadRouter);
router.use('/resizedImages',resizedImages)
router.get('/', (req, res) => {
  res.send('you are in api');
});
export default router;
