const express = require('express');
require('dotenv').config();

const { requireSignin } = require('../controllers/auth');
const { getAllUsers, findUser, attachProfile, updateUser, deleteUser } = require('../controllers/users');

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/user/:userId', requireSignin, findUser);
router.put('/user/:userId', requireSignin, updateUser);
router.delete('/user/:userId', requireSignin, deleteUser);

// any route with :userId, our app would execute attachProfile first
router.param('userId', attachProfile);

module.exports = router;