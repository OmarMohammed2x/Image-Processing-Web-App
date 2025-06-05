import request from 'supertest';
import app from '../server';
import path from 'path';
import resize from '../utils/resize';
import fs from 'fs';
describe('test endpoints', () => {
  const imagePath = path.join(__dirname, 'test.jpg');

  it('should upload a new image', () => {
    request(app).post('/api/upload').attach('img', imagePath).expect(200);
  });
  it('should resize an image', async () => {
    const response = await request(app).get(
      '/api/resize?width=100&height=500&name=test.jpg',
    );

    expect(response.status).toBe(200);
  });
  it('checks if the image is resized successfully', async () => {
    fs.access('../../resizedImages/test[100X500].jpg', (err) => {
      expect(err).toBeNull();
    });
  });
  it('test image processing', async () => {
  expect(async () => {
          await resize(1000, 1000,imagePath , imagePath.replace('.jpg','[1000X1000].jpg'));
      }).not.toThrow();

  });
});
