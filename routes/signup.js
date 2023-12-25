const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const router = express.Router();
const Register = require("./../models/Register");

router.route('/')
    .post(async (req, res) => {
        try {
            // Check if the user already exists
            const existingUser = await Register.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            // Hash the password before saving it
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashedPassword;

            // Create a new user
            await Register.create(req.body);
            
            // Send a success message
            res.status(200).json({ message: "Registration Successful" });
        } catch (error) {
            console.error("Registration Error:", error);

            // Send a generic error message to the client
            res.status(500).json({ message: "Internal Server Error" });
        }
    });

module.exports = router;
