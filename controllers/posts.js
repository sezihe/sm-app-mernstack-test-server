const postsModel = require('../models/posts');

exports.getPosts = (req, res) => {
    const posts = postsModel.find()
        .select("_id title body")
        .then(post => {
            res.status(200).json({ post })
        }).catch(error => {
            console.log(error);
        })
}

exports.createPost = (req, res) => {
    const post = new postsModel(req.body);
    // console.log(post);
    // console.log(req.body);
    post.save().then(result => {
        res.status(200).json({
            post: result,
        })
    })
}