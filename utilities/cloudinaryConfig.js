const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'ds2nijbki',
  api_key: '464441599452541',
  api_secret: 'H1xsbYIXLJUQ3YZ6d3xw9OY4NT0', 
});


// Reusable function for uploading images to Cloudinary
const uploadToCloudinary = (file, folder = 'uploads') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: folder }, (error, result) => {
      if (error) {
        reject('Error uploading image to Cloudinary');
      } else {
        resolve(result.secure_url);
      }
    }).end(file.buffer);
  });
};

module.exports = { upload, uploadToCloudinary };
