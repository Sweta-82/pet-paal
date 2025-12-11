const cloudinary = require('./config/cloudinary');
const dotenv = require('dotenv');
dotenv.config();

console.log('Current Cloudinary Config:');
console.log('Cloud Name:', cloudinary.config().cloud_name);
// Do NOT log api_key or api_secret for security
if (cloudinary.config().api_key) console.log('API Key: [Present]');
else console.log('API Key: [Missing]');
if (cloudinary.config().api_secret) console.log('API Secret: [Present]');
else console.log('API Secret: [Missing]');
