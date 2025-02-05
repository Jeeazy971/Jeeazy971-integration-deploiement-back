const express = require("express");
const { createUser, getUsers, deleteUser, getAdmins } = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", authMiddleware, createUser);
router.get("/", authMiddleware, getUsers);
router.get("/admins", authMiddleware, getAdmins);
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
