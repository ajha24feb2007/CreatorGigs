const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// ===============================
// BASIC SETUP
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files from /public
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// JSON DATABASE
// ===============================

const DATA_FILE = path.join(__dirname, "data.json");

function createDatabase() {
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = {
            creators: [
                {
                    id: 1,
                    name: "Alex",
                    email: "alex@example.com",
                    skill: "Design",
                    price: 500,
                    serviceTitle: "Instagram Post Design",
                    description: "Creative and modern Instagram post designs.",
                    rating: 4.8,
                    reviewCount: 5,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "Rahul",
                    email: "rahul@example.com",
                    skill: "Video Editing",
                    price: 800,
                    serviceTitle: "YouTube Video Editing",
                    description: "Professional editing for YouTube videos and reels.",
                    rating: 4.6,
                    reviewCount: 4,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: "Priya",
                    email: "priya@example.com",
                    skill: "Tutoring",
                    price: 300,
                    serviceTitle: "Math Tutoring",
                    description: "Easy-to-understand mathematics tutoring.",
                    rating: 4.9,
                    reviewCount: 8,
                    createdAt: new Date().toISOString()
                }
            ],
            bookings: [],
            reviews: []
        };

        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(initialData, null, 2)
        );
    }
}

function readDatabase() {
    createDatabase();

    try {
        const data = fs.readFileSync(DATA_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Database read error:", error);

        return {
            creators: [],
            bookings: [],
            reviews: []
        };
    }
}

function saveDatabase(data) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(data, null, 2)
    );
}

createDatabase();

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================
// GET ALL CREATORS
// ===============================

app.get("/api/creators", (req, res) => {
    const db = readDatabase();

    res.json(db.creators);
});

// ===============================
// GET SINGLE CREATOR
// ===============================

app.get("/api/creators/:id", (req, res) => {
    const db = readDatabase();

    const creatorId = Number(req.params.id);

    const creator = db.creators.find(
        creator => creator.id === creatorId
    );

    if (!creator) {
        return res.status(404).json({
            success: false,
            message: "Creator not found"
        });
    }

    res.json(creator);
});

// ===============================
// CREATE NEW CREATOR
// ===============================

app.post("/api/creators", (req, res) => {
    const {
        name,
        email,
        skill,
        price,
        serviceTitle,
        description
    } = req.body;

    // Validation
    if (
        !name ||
        !email ||
        !skill ||
        !price ||
        !serviceTitle ||
        !description
    ) {
        return res.status(400).json({
            success: false,
            message: "Please fill all fields"
        });
    }

    const db = readDatabase();

    const newId =
        db.creators.length > 0
            ? Math.max(...db.creators.map(c => c.id)) + 1
            : 1;

    const newCreator = {
        id: newId,
        name: name.trim(),
        email: email.trim(),
        skill: skill.trim(),
        price: Number(price),
        serviceTitle: serviceTitle.trim(),
        description: description.trim(),
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString()
    };

    db.creators.push(newCreator);

    saveDatabase(db);

    res.status(201).json({
        success: true,
        message: "Creator profile created successfully!",
        creator: newCreator
    });
});

// ===============================
// CREATE BOOKING
// ===============================

app.post("/api/bookings", (req, res) => {
    const {
        creatorId,
        clientName,
        clientEmail,
        bookingDate,
        message
    } = req.body;

    if (
        !creatorId ||
        !clientName ||
        !clientEmail ||
        !bookingDate
    ) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required booking fields"
        });
    }

    const db = readDatabase();

    const creator = db.creators.find(
        c => c.id === Number(creatorId)
    );

    if (!creator) {
        return res.status(404).json({
            success: false,
            message: "Creator not found"
        });
    }

    const newId =
        db.bookings.length > 0
            ? Math.max(...db.bookings.map(b => b.id)) + 1
            : 1;

    const booking = {
        id: newId,
        creatorId: Number(creatorId),
        creatorName: creator.name,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        bookingDate,
        message: message ? message.trim() : "",
        status: "Pending",
        createdAt: new Date().toISOString()
    };

    db.bookings.push(booking);

    saveDatabase(db);

    res.status(201).json({
        success: true,
        message: "Booking request sent successfully!",
        booking
    });
});

// ===============================
// GET ALL BOOKINGS
// ===============================

app.get("/api/bookings", (req, res) => {
    const db = readDatabase();

    res.json(db.bookings);
});

// ===============================
// ADD REVIEW
// ===============================

app.post("/api/reviews", (req, res) => {
    const {
        creatorId,
        reviewerName,
        rating,
        comment
    } = req.body;

    if (
        !creatorId ||
        !reviewerName ||
        !rating ||
        !comment
    ) {
        return res.status(400).json({
            success: false,
            message: "Please fill all review fields"
        });
    }

    const numericRating = Number(rating);

    if (numericRating < 1 || numericRating > 5) {
        return res.status(400).json({
            success: false,
            message: "Rating must be between 1 and 5"
        });
    }

    const db = readDatabase();

    const creator = db.creators.find(
        c => c.id === Number(creatorId)
    );

    if (!creator) {
        return res.status(404).json({
            success: false,
            message: "Creator not found"
        });
    }

    const newId =
        db.reviews.length > 0
            ? Math.max(...db.reviews.map(r => r.id)) + 1
            : 1;

    const review = {
        id: newId,
        creatorId: Number(creatorId),
        reviewerName: reviewerName.trim(),
        rating: numericRating,
        comment: comment.trim(),
        createdAt: new Date().toISOString()
    };

    db.reviews.push(review);

    // Calculate new average rating
    const creatorReviews = db.reviews.filter(
        r => r.creatorId === Number(creatorId)
    );

    const totalRating = creatorReviews.reduce(
        (sum, r) => sum + Number(r.rating),
        0
    );

    const averageRating =
        totalRating / creatorReviews.length;

    creator.rating = Number(averageRating.toFixed(1));
    creator.reviewCount = creatorReviews.length;

    saveDatabase(db);

    res.status(201).json({
        success: true,
        message: "Review added successfully!",
        review,
        newRating: creator.rating,
        reviewCount: creator.reviewCount
    });
});

// ===============================
// GET CREATOR REVIEWS
// ===============================

app.get("/api/creators/:id/reviews", (req, res) => {
    const db = readDatabase();

    const creatorId = Number(req.params.id);

    const reviews = db.reviews.filter(
        review => review.creatorId === creatorId
    );

    res.json(reviews);
});

// ===============================
// 404 API HANDLER
// ===============================

app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at: http://localhost:${PORT}`);
  // baaki console.log lines
});