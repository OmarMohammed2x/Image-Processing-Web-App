import express from 'express';
import uploadRouter from './api/upload';
import resizeRouter from './api/resize';

const router = express.Router();

router.use('/upload', uploadRouter);
router.use('/resize',resizeRouter)

export default router;
