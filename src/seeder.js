import fs from 'fs/promises';
import path from 'path';
import colors from 'colors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { BootCamp } from './models/bootcamp.js';
import { Course } from './models/course.js';
import { User } from './models/user.js';

const __dirname = path.resolve();

// Load env vars
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// Connect to database
connectDB();

const bootcampsFilePath = path.join(
  __dirname,
  'src',
  '_data',
  'bootcamps.json'
);
const coursesFilePath = path.join(__dirname, 'src', '_data', 'courses.json');
const usersFilePath = path.join(__dirname, 'src', '_data', 'users.json');

// Import data into DB
const importData = async () => {
  try {
    const bootcamps = JSON.parse(await fs.readFile(bootcampsFilePath, 'utf8'));
    const courses = JSON.parse(await fs.readFile(coursesFilePath, 'utf8'));
    const users = JSON.parse(await fs.readFile(usersFilePath, 'utf8'));

    await BootCamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await BootCamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Check for command line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
