const express = require("express");
const router = express.Router();;
require('dotenv').config();
const crypto = require("crypto");
const { error } = require("console");

router.post('/webhook', async (req, res) => {
    const key = process.env.WEBHOOK_SECRET; 
    // ^ this value is the 'secret' in the API response from Get Webhooks.
    const body = JSON.stringify(req.body); 
    // ^ JSON.stringify() ensures there are no spaces.
    const hash = crypto.createHmac('sha256', key).update(body); 
    // ^ this is the 
    // required configuration to generate the server-side signature by hashing the 
    // request body using the provided secret and the SHA-256 algorithm.
    const signature = hash.digest('hex'); 
    // ^ the server-side signature to use for comparison.

    try {
        console.log("Received wehbhook data:", req.body);
        const secretValue = req.headers['x-signature']; 
        // ^ Get the signature from the headers of the payload.
        console.log(secretValue);
        if (!secretValue) {
            return res.status(400).send('Missing x-signature header');
        }

        console.log('received x-signature', secretValue); 
        // ^ only for testing, to see the signature sent by a webhook payload 
        console.log(`Compare: [${signature}] vs [${secretValue}]`); 
        // ^ only for testing to compare the signature sent by the webook with 
        // the one generated at my server visually

        res.status(200).json({
            message: 'Payload Received and validated',
            sentSignature: signature,
            originSignature: secretValue,
            data: req.body
        });
    } catch {
        res.status(500).json({
            message: 'Webhook error',
            error: error.message
        });
    }
});

module.exports = router;