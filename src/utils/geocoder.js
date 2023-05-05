import NodeGeocoder from 'node-geocoder';
import dotenv from 'dotenv';

dotenv.config({ path: './src/config/config.env' });

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

export const geocoder = NodeGeocoder(options);
