exports.createPostsValidator = (req, res, next) => {
    // title param validation
    req.check('title', "Title is required").notEmpty();
    req.check('title', "Title must be at least 4 characters and less than 150 characters").isLength({
        min: 4,
        max: 150,
    });

    // body param validation
    req.check('body', "Body is required").notEmpty();
    req.check('body', "Body must be at least 4 characters and less than 2000 characters").isLength({
        min: 4,
        max: 2000,
    })

    // check for errors and return the errors as they appear.
    const errors = req.validationErrors();

    if(errors) {
        const error = errors.map((err) => err.msg);
        return res.status(200).json({ error: error[0] });
    }

    // lets make sure the app continues to the next middleware. Regardless of if there's a Validationerror
    // proceed to next middleware
    next();
}