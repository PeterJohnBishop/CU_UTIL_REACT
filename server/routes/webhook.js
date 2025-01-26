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
            res.status(200).json({
                message: 'Payload Received and validated',
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