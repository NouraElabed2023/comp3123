const {
  signup,
  login,
  resetPassword,
} = require("../Controllers/AuthController");
const {
  signupValidation,
  loginValidation,
} = require("../Schema/AuthValidation");

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
router.post("/reset-password/:userId/:token", resetPassword);

module.exports = router;
