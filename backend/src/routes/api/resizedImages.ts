import express from 'express';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import { promises as fs } from 'fs';
const resizeRouter = express.Router();

async function resize(
  width: number,
  height: number,
  originalPath: string,
  newPath: string,
) {
  await sharp(originalPath)
    .resize(Number(width), Number(height))
    .toFile(newPath)
    .then(() => {
      console.log('the image is successfullu resized <>');
    })
    .catch((err) => {
      console.error('Error resizing image:', err);
    });
}

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
    const dashIndex = name.indexOf("-");
    const newName = name.slice(dashIndex + 1);
    const originalPath = path.join(__dirname, '..', '..','..', './', 'images', name);
    const newImagePath = path.join(
      __dirname,
      '..',
      '..','..',
      './',
      'resizedImages',
      newName.replace(/\.jpg/i, `[${width}X${height}].jpg`),
    );

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
          console.log('the image is successfullu resized <>');
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
