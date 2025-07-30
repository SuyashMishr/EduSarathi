const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadDir;
    
    // Create subdirectories based on file type
    if (file.fieldname === 'answerSheet') {
      uploadPath = path.join(uploadDir, 'answer-sheets');
    } else if (file.fieldname === 'curriculum') {
      uploadPath = path.join(uploadDir, 'curriculum');
    } else if (file.fieldname === 'slides') {
      uploadPath = path.join(uploadDir, 'slides');
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedTypes = {
    'answerSheet': ['.jpg', '.jpeg', '.png', '.pdf'],
    'curriculum': ['.pdf', '.doc', '.docx', '.txt'],
    'slides': ['.ppt', '.pptx', '.pdf'],
    'default': ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.txt']
  };
  
  const extension = path.extname(file.originalname).toLowerCase();
  const fieldAllowedTypes = allowedTypes[file.fieldname] || allowedTypes.default;
  
  if (fieldAllowedTypes.includes(extension)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types for ${file.fieldname}: ${fieldAllowedTypes.join(', ')}`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 5 // Maximum 5 files per request
  },
  fileFilter: fileFilter
});

// Export different upload configurations
module.exports = {
  // Single file upload
  single: (fieldName) => upload.single(fieldName),
  
  // Multiple files upload
  multiple: (fieldName, maxCount = 5) => upload.array(fieldName, maxCount),
  
  // Multiple fields upload
  fields: (fields) => upload.fields(fields),
  
  // Answer sheet specific upload
  answerSheet: upload.single('answerSheet'),
  
  // Curriculum file upload
  curriculumFile: upload.single('curriculum'),
  
  // Slides upload
  slidesFile: upload.single('slides'),
  
  // Error handler middleware
  handleError: (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size allowed is 10MB.'
        });
      }
      if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum 5 files allowed.'
        });
      }
    }
    
    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    next(error);
  }
};