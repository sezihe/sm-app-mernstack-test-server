const express = require('express');

const { getPosts, createPost } = require('../controllers/posts');
const postsValidator = require('../validator');

const router = express.Router();

// route requests to controller
router.get('/', getPosts);
router.post('/post', postsValidator.createPostsValidator, createPost);

module.exports = router;