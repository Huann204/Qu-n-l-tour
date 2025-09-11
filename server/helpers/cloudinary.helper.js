const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARAY_NAME,
  api_key: process.env.CLOUDINARAY_API_KEY,
  api_secret: process.env.CLOUDINARAY_API_SECRET
}); 

module.exports.storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});