const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Project Model
const Project = require("./models/Project");

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ MongoDB Error:", err));

// ======================
// ROUTES
// ======================

// Home Page
app.get("/", (req, res) => {
    res.render("home");
});

// About Page
app.get("/about", (req, res) => {
    res.render("about");
});

// Skills Page
app.get("/skills", (req, res) => {
    res.render("skills");
});

// Projects Page
app.get("/projects", async (req, res) => {
    try {
        const projects = await Project.find();
        res.render("projects", { projects });
    } catch (error) {
        console.error(error);
        res.send("Error loading projects");
    }
});

// Contact Page
app.get("/contact", (req, res) => {
    res.render("contact");
});

// Admin Dashboard
app.get("/admin", (req, res) => {
    res.render("admin");
});

// Add Project
app.post("/admin/add", async (req, res) => {
    try {
        await Project.create({
            title: req.body.title,
            description: req.body.description,
            githubLink: req.body.githubLink
        });

        res.redirect("/projects");

    } catch (error) {
        console.error(error);
        res.send("Error adding project");
    }
});

// Delete Project
app.post("/delete/:id", async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.redirect("/projects");

    } catch (error) {
        console.error(error);
        res.send("Error deleting project");
    }
});

// ======================
// SERVER
// ======================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});