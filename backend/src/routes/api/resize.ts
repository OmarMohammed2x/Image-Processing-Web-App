import express from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import resize from '../../utils/resize';
const resizeRouter = express.Router();

async function isExisted(path: string): Promise<boolean> {
  try {
    await fs.access(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
resizeRouter.get('/', async (req, res) => {
  try {
    const width = parseInt(req.query.width as string, 10);
    const height = parseInt(req.query.height as string, 10);
    const name = req.query.name as string;
    if (!name.includes('.jpg')) {
      res.status(404).send('invalid image type');
    }
    const originalPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      './',
      'images',
      name,
    );
    const newImagePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      './',
      'resizedImages',
      name.replace(/\.jpg/i, `[${width}X${height}].jpg`),
    );

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      res
        .status(403)
        .send('Invalid width or height. Both must be positive integers.');
      return;
    } else if (!name) {
      res.status(405).send('The image name is required!');
      return;
    }
    if (await isExisted(newImagePath)) {
      // handle if the image is already existed
      res.status(401).send(newImagePath);
    } else {
      await resize(width, height, originalPath, newImagePath);

      res.status(200).send(newImagePath);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred in the resize route');
  }
});

export default resizeRouter;
