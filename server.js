const express = require("express");
const cors = require("cors");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const app = express();

app.use(cors());
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("اعمل Scan للـ QR");
});

client.on("ready", () => {
    console.log("WhatsApp Ready");
});

client.initialize();

app.post("/send-code", async (req, res) => {

    const number = req.body.number;

    const otp = Math.floor(100000 + Math.random() * 900000);

    try {

        await client.sendMessage(
            number + "@c.us",
            `كود تسجيل الدخول: ${otp}`
        );

        res.json({
            success: true
        });

    } catch (err) {

        res.json({
            success: false,
            error: err.toString()
        });

    }

});

app.listen(3000, () => {
    console.log("Server Started");
});