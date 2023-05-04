import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { mountRoutes } from './routes/index.js';

// Load env vars
dotenv.config({ path: './src/config/config.env' });

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount Routes
mountRoutes(app);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server Running In ${process.env.NODE_ENV} Mode On Port ${PORT}`)
);
