import express from 'express';
import router from './routes/index';
import cors from 'cors';
const app = express();
const port = 3000;
app.use(cors());
app.use('/api', router);
// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
export default app;
