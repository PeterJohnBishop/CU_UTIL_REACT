const express = require("express");
const router = express.Router();;
const axios = require("axios");
require('dotenv').config();

// First complete this URL https://app.clickup.com/api?client_id={client_id}&redirect_uri={redirect_uri} then navigate to it to start OAuth
// * URL's like https://www.mysite.com/success will appear truncated in ClickUp: mysite.com
// * This is because you may want to change the redirect from https://www.mysite.com/development/test to https://www.mysite.com/production/success 
// * so only having a matching uri (mysite.com) matters here.
// Once authenticated a CODE will be appended to the redirect url like, ttps://www.mysite.com/development/test?code=fj9348gofh4389900923huf98n4
// * this code must be read from the URL and sent to /getAuthToken below in the request body. 
// * the response from this request will be a JWT to use as a Bearer Token in subsequent API requests to ClickUp. 

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