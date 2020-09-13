const express = require('express');

const { getPosts, createPost } = require('../controllers/posts');
const { requireSignin } = require('../controllers/auth');
const postsValidator = require('../validator');

const router = express.Router();

// route requests to controller
router.get('/', requireSignin, getPosts);
router.post('/post', postsValidator.createPostsValidator, createPost);

module.exports = router;