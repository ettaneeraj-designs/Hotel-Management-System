const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3001;


// ===============================
// Middleware
// ===============================

app.use(express.json());

app.use((req, res, next) => {
    console.log("Middleware executed!");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    next();
});

app.use(express.static(__dirname));


// ===============================
// MongoDB Connection
// ===============================

mongoose.connect("mongodb://127.0.0.1:27017/hotelDB")
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });


// ===============================
// User Schema
// ===============================

const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    uname: String,
    dob: String,
    pwd: String,
    mobile: String,
    postal: String,
    email: String
});

const User = mongoose.model("User", userSchema);


// ===============================
// Booking Schema
// ===============================

const bookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    room: String,
    price: Number,
    checkIn: String,
    checkOut: String,
    guests: Number
});

const Booking = mongoose.model("Booking", bookingSchema);


// ===============================
// Rooms
// ===============================

const rooms = [
    {
        id: 1,
        name: "Standard Room",
        price: 2000
    },
    {
        id: 2,
        name: "Suite",
        price: 3500
    },
    {
        id: 3,
        name: "Deluxe Room",
        price: 5000
    }
];


// ===============================
// GET - Get All Rooms
// ===============================

app.get("/api/rooms", (req, res) => {

    res.json(rooms);

});


// ===============================
// POST - Signup
// ===============================

app.post("/api/signup", async (req, res) => {

    try {

        const user = new User(req.body);

        await user.save();

        console.log("User registered:");
        console.log(user);

        res.status(201).json({
            message: "Account created successfully!"
        });

    }
    catch (error) {

        console.log(error);

        res.status(400).json({
            message: "Username already exists or invalid data."
        });

    }

});


// ===============================
// POST - Login
// ===============================

app.post("/api/login", async (req, res) => {

    try {

        const { uname, pwd } = req.body;

        const user = await User.findOne({
            uname: uname,
            pwd: pwd
        });

        if (!user) {

            return res.status(401).json({
                message: "Invalid username or password."
            });

        }

        res.json({

            message: "Login successful!",

            user: {
                uname: user.uname,
                email: user.email
            }

        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Login failed."
        });

    }

});


// ===============================
// GET - Get User Profile
// ===============================

app.get("/api/users/:uname", async (req, res) => {

    try {

        const user = await User.findOne({
            uname: req.params.uname
        });

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.json(user);

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to get user"
        });

    }

});


// ===============================
// PUT - Update User Profile
// ===============================

app.put("/api/users/:uname", async (req, res) => {

    try {

        const user = await User.findOneAndUpdate(

            {
                uname: req.params.uname
            },

            req.body,

            {
                new: true
            }

        );

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        console.log("User updated:");
        console.log(user);

        res.json({

            message: "Profile updated successfully!",

            user: user

        });

    }
    catch (error) {

        console.log(error);

        res.status(400).json({
            message: "Profile update failed."
        });

    }

});


// ===============================
// POST - Create Booking
// ===============================

app.post("/api/bookings", async (req, res) => {

    try {

        const booking = new Booking(req.body);

        await booking.save();

        console.log("Booking saved:");
        console.log(booking);

        res.status(201).json({

            message: "Booking confirmed successfully!",

            booking: booking

        });

    }
    catch (error) {

        console.log(error);

        res.status(400).json({
            message: "Booking failed."
        });

    }

});


// ===============================
// GET - Get All Bookings
// ===============================

app.get("/api/bookings", async (req, res) => {

    try {

        const bookings = await Booking.find();

        res.json(bookings);

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to get bookings."
        });

    }

});


// ===============================
// GET - Get User Bookings
// ===============================

app.get("/api/bookings/:email", async (req, res) => {

    try {

        const bookings = await Booking.find({

            email: req.params.email

        });

        res.json(bookings);

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to get user bookings."
        });

    }

});


// ===============================
// PUT - Update Booking
// ===============================

app.put("/api/bookings/:id", async (req, res) => {

    try {

        const booking = await Booking.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new: true
            }

        );

        if (!booking) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }

        console.log("Booking updated:");
        console.log(booking);

        res.json({

            message: "Booking updated successfully!",

            booking: booking

        });

    }
    catch (error) {

        console.log(error);

        res.status(400).json({
            message: "Invalid booking ID."
        });

    }

});


// ===============================
// DELETE - Delete Booking
// ===============================

app.delete("/api/bookings/:id", async (req, res) => {

    try {

        const booking =
            await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }

        console.log(
            "Booking deleted:",
            req.params.id
        );

        res.json({

            message: "Booking deleted successfully!"

        });

    }
    catch (error) {

        console.log(error);

        res.status(400).json({
            message: "Invalid booking ID."
        });

    }

});


// ===============================
// Start Server
// ===============================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});