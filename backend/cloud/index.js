// Cloudinary API
var cloudinary = require('cloudinary').v2;

// Cloudinary configuration
  cloudinary.config({
    cloud_name: "dq5nlxmcn",
    api_key: "3444444444444444",
    api_secret: "ajtrio4-3-4mg0e934gjmr9",
    secure: true
  });

  module.exports = cloudinary;