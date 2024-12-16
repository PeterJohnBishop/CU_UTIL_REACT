const express = require("express");
const router = express.Router();;
const axios = require("axios");
require('dotenv').config();

router.post('/getAuthToken', async (req, res) => {

    const accessCode = req.body.accessCode;
    console.log(`Access Code: ${accessCode}`)

    const query = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: accessCode,
      }).toString();

    const url = `https://api.clickup.com/api/v2/oauth/token?${query}`;
    console.log(url);
    
    try {
        const response = await axios.post(url);
    
        res.status(200).json({
          message: 'Request successful',
          response: response.data,
        });
      } catch (error) {
        console.error('Error getting Authentication Token:', error.message);
        res.status(500).json({
          message: 'Error getting Authentication Token',
          error: error.message,
        });
      }
  });
  
  module.exports = router;