const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_KEY = process.env.JWT_KEY ;
const adminEmail = process.env.adminEmail;
const adminPassword = process.env.adminPassword ;

router.post("/auth", (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ error: "email and password are required" });
    }

    if (!JWT_KEY) {
        return res.status(500).json({ error: "server misconfigured: missing JWT key" });
    }

    if (email === adminEmail && password === adminPassword) {
        const token = jwt.sign(
            { email },
            JWT_KEY,
            { expiresIn: "1h" }
        );
        res.status(200).json({ token: token });
    } else {
        res.status(400).json({ error: "invalid credentials" });
    }
});

module.exports = router;