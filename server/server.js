const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const cors = require('cors');
const app = express();
const http = require('http'); 
const OAuthRoutes = require("./routes/oauth.js");
const WebhookRoutes = require("./routes/webhook.js");
const AttachmentRoutes = require("./routes/attach.js")

dotenv.config();

const PORT = process.env.PORT;

// In user custom apps when a CORS error is returned it's because ClickUp's server only allows request from specific domains. 
// Here my server only allows requests from the domain 'http://localhost' on any port, 
// or from my hosted server at https://obscure-dawn-20990-34de273bc864.herokuapp.com
const allowedOrigins = [
    /^http:\/\/localhost(:\d+)?$/, //localhost:allports
    "https://obscure-dawn-20990-34de273bc864.herokuapp.com/"
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
        // Allow requests with no origin (like mobile apps or curl requests)
        callback(null, true);
        } else if (allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
        callback(null, true);
        } else {
        callback(new Error('Not allowed by CORS'));
        }
    },
};

app.use(bodyParser.json());
app.use(cors());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Welcome to CU_UTIL Server!');
});

app.use("/auth", OAuthRoutes);
app.use("/webhooks", WebhookRoutes)
app.use("/attachment", AttachmentRoutes)
; 
const server = http.createServer(app);

server.listen(PORT, () => {
  // console.log(`HTTP server listening on https://obscure-dawn-20990-34de273bc864.herokuapp.com/:${PORT}`);
  console.log(`HTTP server listening on http://localhost:${PORT}`);
});