const express = require("express");
const { login, registerAdmin } = require("../controllers/authController");
const router = express.Router();

router.post('/login', login);
router.post('/register-admin', registerAdmin);

module.exports = router;
