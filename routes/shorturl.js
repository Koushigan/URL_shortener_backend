const express = require('express');
const router = express.Router();
const Shorturl = require('../models/Shorturl');

router.route('/')
    .post(async (req, res) => {
        try {
            // Create a new Shorturl document
            await Shorturl.create({ fullURL: req.body.url });

            // Retrieve the newly created Shorturl document
            let data = await Shorturl.findOne({ fullURL: req.body.url });

            // Send the short URL in the response
            res.status(200).json({ shorturl: data.shortURL });
        } catch (error) {
            console.error('Error creating short URL:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

module.exports = router;
