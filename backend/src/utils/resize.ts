import sharp from 'sharp';
async function resize(
  width: number,
  height: number,
  originalPath: string,
  newPath: string,
) {
  await sharp(originalPath)
    .resize(width, height)
    .toFile(newPath)
    .then(() => {
      console.log('the image is successfullu resized');
    })
    .catch((err) => {
      console.error('Error resizing image:', err);
    });
}
export default resize;
