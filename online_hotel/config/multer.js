const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/images', // Directory to save images
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB file size limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('image');

// Setup for multiple file uploads (for conference spaces)
const conferenceStorage = multer.diskStorage({
  destination: './uploads/conferences', // Directory to save conference files
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadMultiple = multer({
  storage: conferenceStorage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).fields([
  { name: 'venueImages', maxCount: 5 }, 
  { name: 'videoTours', maxCount: 4 }, 
  { name: 'floorPlans', maxCount: 4 }
]);


// Separate storage engine for profile image uploads
const profileStorage = multer.diskStorage({
  destination: './uploads/profile-images', // Directory to save profile images
  filename: (req, file, cb) => {
    cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload variable for profile images
const uploadProfileImage = multer({
  storage: profileStorage,
  limits: { fileSize: 1000000 }, // 1MB file size limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb); // Reusing the checkFileType function
  }
}).single('profileImage'); // Ensure the field name matches what you're sending from the frontend

function checkFileType(file, cb) {
  // Allowed file extensions for images
  const imageFiletypes = /jpeg|jpg|png|gif/;
  // Allowed file extensions for videos
  const videoFiletypes = /mp4|webm|ogg/;
  
  // Check if the file is an image
  const isImage = imageFiletypes.test(path.extname(file.originalname).toLowerCase());
  // Check if the file is a video
  const isVideo = videoFiletypes.test(path.extname(file.originalname).toLowerCase());

  // Check MIME type for images
  const imageMimetype = imageFiletypes.test(file.mimetype);
  // Check MIME type for videos
  const videoMimetype = videoFiletypes.test(file.mimetype);

  // Allow image or video files based on their MIME type or extension
  if ((isImage && imageMimetype) || (isVideo && videoMimetype)) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images and Videos Only!'));
  }
}


module.exports = { upload, uploadMultiple,  uploadProfileImage };

// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Helper function to ensure directory exists
// const ensureDirExists = (dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };

// // Set storage engine for images
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = process.env.IMAGE_UPLOAD_PATH || './uploads/images'; // Fallback for local
//     ensureDirExists(dir); // Ensure the directory exists
//     cb(null, dir); // Directory to save images
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Custom filename
//   }
// });

// // Initialize upload variable for images
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 }, // 1MB file size limit
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb); // Ensure only images are allowed
//   }
// }).single('image'); // Single image upload

// // Setup for multiple file uploads (for conference spaces)
// const conferenceStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = process.env.IMAGE_UPLOAD_PATH + '/conferences'; // Adjust the path for conferences
//     ensureDirExists(dir);
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Custom filename
//   }
// });

// const uploadMultiple = multer({
//   storage: conferenceStorage,
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb); // Ensure valid file types
//   }
// }).fields([
//   { name: 'venueImages', maxCount: 5 }, 
//   { name: 'videoTours', maxCount: 4 }, 
//   { name: 'floorPlans', maxCount: 4 }
// ]);

// // Separate storage engine for profile image uploads
// const profileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = process.env.IMAGE_UPLOAD_PATH + '/profile-images'; // Adjust the path for profile images
//     ensureDirExists(dir);
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, 'profile-' + Date.now() + path.extname(file.originalname)); // Custom filename
//   }
// });

// // Initialize upload variable for profile images
// const uploadProfileImage = multer({
//   storage: profileStorage,
//   limits: { fileSize: 1000000 }, // 1MB file size limit
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb); // Reusing the checkFileType function
//   }
// }).single('profileImage'); // Ensure the field name matches what you're sending from the frontend

// function checkFileType(file, cb) {
//   // Allowed file extensions for images
//   const imageFiletypes = /jpeg|jpg|png|gif/;
//   // Allowed file extensions for videos
//   const videoFiletypes = /mp4|webm|ogg/;
  
//   // Check if the file is an image
//   const isImage = imageFiletypes.test(path.extname(file.originalname).toLowerCase());
//   // Check if the file is a video
//   const isVideo = videoFiletypes.test(path.extname(file.originalname).toLowerCase());

//   // Check MIME type for images
//   const imageMimetype = imageFiletypes.test(file.mimetype);
//   // Check MIME type for videos
//   const videoMimetype = videoFiletypes.test(file.mimetype);

//   // Allow image or video files based on their MIME type or extension
//   if ((isImage && imageMimetype) || (isVideo && videoMimetype)) {
//     return cb(null, true);
//   } else {
//     cb(new Error('Error: Images and Videos Only!'));
//   }
// }

// module.exports = { upload, uploadMultiple, uploadProfileImage };
