const express = require("express");
const router = express.Router();;
require('dotenv').config();
const crypto = require("crypto");
const { error } = require("console");

router.post('/webhook', async (req, res) => {
    const key = process.env.WEBHOOK_SECRET;
    const body = JSON.stringify(req.body);
    const hash = crypto.createHmac('sha2565', key).update(body);
    const signature = hash.digest('hex');

    try {
        console.log("Received wehbhook data:", req.body);
        const secretValue = req.headers['x-secret'];

        if (!secretValue) {
            return res.status(400).send('Missing x-secret header');
        }

        console.log('received x-secret', secretValue);
        console.log(`Compare: [${key}] vs [${secretValue}]`);

        res.status(200).json({
            message: 'Payload Received and validated',
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