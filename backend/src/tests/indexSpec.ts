import request from 'supertest';
import app from '../server';
import path from 'path';
import fs from 'fs';
describe('test endpoints', () => {
  it('should upload a new image', () => {
    const imagePath = path.join(__dirname, 'test-image.jpg');
    request(app).post('/api/upload').attach('img', imagePath).expect(200);
  });
  it('should resize an image', async () => {
    const response = await request(app).get(
      '/api/resize?width=100&height=500&name=fjord.jpg',
    );

    expect(response.status).toBe(200);
  });
  it('checks if the image is resized successfully', async () => {
    fs.access('../../resizedImages/fjord[100X500].jpg', (err) => {
      expect(err).toBeNull();
    });
  });
});
