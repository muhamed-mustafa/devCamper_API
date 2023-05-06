import fs from 'fs';
import { BootCamp } from './models/bootcamp.js';
import { Course } from './models/course.js';
import colors from 'colors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: './src/config/config.env' });

// Connect to database
connectDB();

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf8')
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf8')
);

// Import data into DB
const importData = async () => {
  try {
    await BootCamp.create(bootcamps);
    // await Course.create(courses);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(err);
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await BootCamp.deleteMany();
    await Course.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Check for command line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
