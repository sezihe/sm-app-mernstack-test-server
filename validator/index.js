const passwordValidator = require('password-validator');
const { schema } = require('../models/posts');

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

    if (errors) {
        const error = errors.map((err) => err.msg);
        return res.status(400).json({ error: error[0] });
    }

    // lets make sure the app continues to the next middleware. Regardless of if there's a Validationerror
    // proceed to next middleware
    next();
}

exports.signupUserValidator = (req, res, next) => {
    // name param validation
    req.check('name', "Name is required").notEmpty();
    req.check('name', "Name must be atleast 3 characters and less than 50 characters").isLength({
        min: 3,
        max: 50,
    });

    // email param validation
    req.check('email', "Email Address is required").notEmpty();
    req.check('email', "Please enter a valid email address!").isEmail();

    // password param validation
    req.check('password', "Password is required").notEmpty();
    req.check('password', "Password must have atleast 6 characters").isLength({ min: 6 });
    
    // using passwordValidator to check some other things.
    // create a schema
    const passValidatorSchema = new passwordValidator();

    // add properties
    passValidatorSchema
        .has().uppercase()
        .has().lowercase()
        .has().digits()
        .has().symbols();

    // use schema to validate password
    const validPassword = passValidatorSchema.validate(req.body.password, { list: true });
    
    // check for errors and return the errors as they appear.
    const errors = req.validationErrors();
    if (errors) {
        const error = errors.map(err => err.msg);
        return res.status(400).json({ error: error[0] });
    }

    // check for password validation error
    if(validPassword.length > 0) {
        console.log(validPassword);
        return res.status(400).json({ error: "Password must contain at least: 1 Capital letter & Small letter, 1 Special character and a number"})
    }

    // lets make sure the app continues to the next middleware. Regardless of if there's a Validationerror
    // proceed to next middleware
    next();
}

exports.signinUserValidator = (req, res, next) => {
    // email param validation
    req.check('email', "Email is required").notEmpty();

    // password param validation
    req.check('password', "Password is required").notEmpty();

    // check for errors and return the errors as they appear.
    const errors = req.validationErrors();
    if(errors) {
        const error = errors.map(err => err.msg);
        return res.status(400).json({ error: error[0] });
    }

    // lets make sure the app continues to the next middleware. Regardless of if there's a Validationerror
    // proceed to next middleware
    next();
}