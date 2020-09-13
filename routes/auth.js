const express = require('express');

const { signup, signin, signout } = require('../controllers/auth');
const { signupUserValidator, signinUserValidator } = require('../validator');

const router = express.Router();

// route requests to controller
router.post('/signup', signupUserValidator, signup);
router.post('/signin', signinUserValidator, signin);
router.get('/signout', signout);

module.exports = router;