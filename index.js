const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

let savedOTP = {};

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log("امسح QR من واتساب");
});

client.on('ready', () => {
    console.log('WhatsApp Ready!');
});

client.initialize();

app.post('/send-otp', async (req, res) => {

    const number = req.body.number;

    const otp =
    Math.floor(100000 + Math.random() * 900000);

    savedOTP[number] = otp;

    try {

        await client.sendMessage(
            number + "@c.us",
            `🔐 your Verification Code: ${otp}`
        );

        res.json({
            success: true
        });

    } catch (err) {

        res.json({
            success: false,
            error: err.message
        });

    }

});

app.post('/verify-otp', (req, res) => {

    const number = req.body.number;
    const otp = req.body.otp;

    if(savedOTP[number] == otp){

        res.json({
            success: true
        });

    } else {

        res.json({
            success: false
        });

    }

});

app.listen(3000, () => {
    console.log("Server running on 3000");
});