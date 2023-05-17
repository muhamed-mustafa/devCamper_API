import colors from 'colors';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import path from 'path';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';

import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { mountRoutes } from './routes/index.js';
import { errorHandler } from './middleware/error.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// Connect to database
connectDB();

const app = express();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});

app.use([
  express.json(),
  cookieParser(),
  fileUpload(),
  express.static(path.join(__dirname, 'public')),
  mongoSanitize(),
  helmet(),
  xss(),
  hpp(),
  cors(),
  limiter,
]);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount Routes
mountRoutes(app);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}.red`);
  server.close(() => process.exit(1));
});
