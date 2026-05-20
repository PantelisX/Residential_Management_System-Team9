/*
ΕΝΔΕΙΚΤΙΚΟΣ ΚΩΔΙΚΑΣ ΓΙΑ ΤΗΝ ΣΥΝΔΕΣΗ ΤΩΝ Routes | Middleware | Controllers
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");


const authMiddleware = require("../middlewares/authMiddleware");

//Routes για την αυθεντικοποίηση των χρηστών
router.post("/register", authController.register);
router.post("/login", authController.login);

*/
