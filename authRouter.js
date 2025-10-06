const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_KEY = process.env.JWT_KEY;
const adminEmail = process.env.adminEmail;
const adminPassword = process.env.adminPassword;

router.post("/auth", (req, res) => {
    const { email, password } = req.body;

    if (email === adminEmail && password === adminPassword) {
        const token = jwt.sign(
            { email },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );
        res.status(200).json({ token: token });
    } else {
        res.status(400).json({ error: "invalid credentials" });
    }
});

module.exports = router;