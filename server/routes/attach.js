const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
require('dotenv').config();

const router = express.Router();
  
const upload = multer({
    dest: 'uploads/', 
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed.'));
      }
    },
  });
  
  router.post('/upload/:taskId', upload.single('file'), async (req, res) => {

    const { taskId } = req.params;

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }
  
      const filePath = path.resolve(req.file.path);
      const fileName = req.file.originalname;
  
      const formData = new FormData();
      formData.append('attachment', fs.createReadStream(filePath), fileName);
  
      const clickUpResponse = await axios.post(
        `https://api.clickup.com/api/v2/task/${taskId}/attachment`,
        formData,
        {
          headers: {
            ...formData.getHeaders(), 
            Authorization: process.env.CU_API_KEY, // replace with your personal API key
          },
        }
      );
  
      fs.unlinkSync(filePath);
  
      res.status(200).json({ message: 'File uploaded successfully!', data: clickUpResponse.data });
    } catch (error) {
      console.error(error);
  
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
  
      if (error.response) {
        res.status(error.response.status).json({
          error: error.response.data,
        });
      } else {
        res.status(500).json({
          error: 'Internal server error',
          details: error.message,
        });
      }
    }
  });

  module.exports = router;