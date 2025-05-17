import express from 'express';
import path from 'path';
import sharp from 'sharp';
import { promises as fs } from 'fs';
const resizeRouter = express.Router();

// async function resize(
//   width: number,
//   height: number,
//   originalPath: string,
//   newPath: string,
// ) {
//   await sharp(originalPath)
//     .resize(Number(width), Number(height))
//     .toFile(newPath)
//     .then(() => {
//       console.log('the image is successfullu resized <>');
//     })
//     .catch((err) => {
//       console.error('Error resizing image:', err);
//     });
// }

async function isExisted(path: string): Promise<boolean> {
  try {
    await fs.access(path, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}
resizeRouter.get('/', async (req, res) => {
  try {
    const width = parseInt(req.query.width as string, 10);
    const height = parseInt(req.query.height as string, 10);
    const name = req.query.name as string;
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
        .status(400)
        .send('Invalid width or height. Both must be positive integers.');
      return;
    }
    if (await isExisted(newImagePath)) {
      // handle if the image is already existed
      res.sendFile(newImagePath, (err) => {
        if (err) {
          return res.send('A problem occured during sending the Image');
        }
      });
    } else {
      await sharp(originalPath)
        .resize(width, height)
        .toFile(newImagePath)
        .then(() => {
          console.log('the image is successfullu resized');
        })
        .catch((err) => {
          console.error('Error resizing image:', err);
        });
      res.sendFile(newImagePath, (err) => {
        if (err) {
          return res.send(
            'A problem occured during sending the Image after resizing',
          );
        }
      });
    }
  } catch (error) {
    res.status(500).send('An error occurred in the resize route');
  }
});

export default resizeRouter;
