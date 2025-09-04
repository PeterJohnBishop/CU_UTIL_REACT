// webhook endpoint hosted at https://obscure-dawn-20990-34de273bc864.herokuapp.com/webhooks/webhook
// Create a webhook via the ClickUp API to send payloads to this endpoint
// On creation the new webhook will have a property called 'secret' which you should save to the 
// .env file as WEBHOOK_SECRET=your_secret_here
// This secret is used to validate the payload signature sent by ClickUp
// The webhook will send a POST request to this endpoint with a JSON payload and a signature in the header
// The signature is a HMAC-SHA256 hash of the payload using the secret as the key
// This endpoint will validate the signature and respond with a 200 status if the signature is valid
// If the signature is invalid the endpoint will respond with a 403 status
// If the endpoint encounters an error it will respond with a 500 status
// The payload will be logged to the console if the signature is valid

const express = require("express");
const router = express.Router();;
require('dotenv').config();
const crypto = require("crypto");
const { error } = require("console");

router.post('/webhook', async (req, res) => {
    const key = process.env.WEBHOOK_SECRET;
    const body = JSON.stringify(req.body);
    const hash = crypto.createHmac('sha256', key).update(body);
    const signature = hash.digest('hex');

    try {
        const secretValue = req.headers['x-signature'];
        if (!secretValue) {
            return res.status(400).send('Missing x-signature header');
        }
        if (secretValue === signature) {
            res.status(400).json({
                message: 'Payload Received and validated - Rejecting for signature test',
                data: req.body
            });
        } else {
            res.status(403).send({
                message: "Unable to validate payload signature."
            });
        }
    } catch {
        res.status(500).json({
            message: 'Webhook error',
            error: error.message
        });
    }
});

module.exports = router;