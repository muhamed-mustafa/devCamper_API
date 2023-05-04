import express from 'express';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: './src/config/config.env' });

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server Running In ${process.env.NODE_ENV} Mode On Port ${PORT}`)
);
