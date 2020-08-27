const express = require('express');

const { signup, signin } = require('../controllers/auth');
const { signupUserValidator, signinUserValidator } = require('../validator');

const router = express.Router();

// route requests to controller
router.post('/signup', signupUserValidator, signup);
router.post('/signin', signinUserValidator, signin);

module.exports = router;