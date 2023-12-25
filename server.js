const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const dotenv = require("dotenv");
const bodyparser = require('body-parser');
const Shorturl = require('./models/Shorturl');
const Register = require("./models/Register");
const short = require('./routes/shorturl');
const cors = require('cors');
const login = require('./routes/login');
const signup = require('./routes/signup');

const app = express();
const db_url = process.env.DB_URL;
const port = process.env.PORT || 5000;

dotenv.config();

mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: false }));

// Add this middleware if you need to serve static files
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/shorturl', short);
app.use("/login", login);
app.use("/signup", signup);

app.get("/", (req, res) => {
    try {
        res.send("Welcome to the URL shortener");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Root route
app.get('/load', async (req, res) => {
    try {
        let data = await Shorturl.find();
        if (data == null) return res.status(200).json({ message: "Data not found" });
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get('/:shorturl', async (req, res) => {
    try {
        let data = await Shorturl.findOne({ shortURL: req.params.shorturl });
        if (data == null) return res.status(404).json({ message: "URL not found" });
        data.clicks++;
        data.save();
        res.status(200).redirect(data.fullURL);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
});

app.listen(port, () => console.log(`Server started at ${port}`));
