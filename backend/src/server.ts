import express from "express";
import fs from "fs";
import { promises as fsPromises } from "fs";

const app = express();
const port = 3000;

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
