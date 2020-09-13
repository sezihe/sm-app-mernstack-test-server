const passwordValidator = require('password-validator');
const yup = require('yup');
const { schema } = require('../models/posts');

exports.createPostsValidator = async (req, res, next) => {
    // validation schema
    const yupSchema = yup.object().shape({
        // title validation.
        title: yup.string().trim()
            .matches(/[\w\-]/i, "Body must contain only valid characters")
            .min(4, "Title must be at least 4 characters")
            .max(150, "Title must not be more than 150 characters")
            .required("Title is required"),

        // body validation.    
        body: yup.string().trim()
            .matches(/[\w\-]/i, "Body must contain only valid characters")
            .min(4, "Body must be at least 4 characters")
            .max(2000, "Body must not be more than 150 characters")
            .required("Body is required"),
    });

    // check for errors and return the errors.
    const { title, body } = req.body;
    try {
        // use schema to validate request
        await yupSchema.validate({
            title,
            body,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    // lets make sure the app continues to the next middleware. Regardless of if there's a Validationerror
    // proceed to next middleware
    next();
}

exports.signupUserValidator = async (req, res, next) => {

    // validation schema
    const yupSchema = yup.object().shape({
        // name validation.
        name: yup.string().trim()
            .matches(/[\w\-]/i, "Name must contain only valid characters")
            .min(3, "Name must be at least 3 characters")
            .max(50, "Name must not be more than 50 characters")
            .required("Name is required"),

        // email validation.    
        email: yup.string().trim()
            .min(5, "Email Address must be at least 5 characters")
            .email("Please enter a valid email address!")
            .required("Email Address is required"),

        // password validation. 
        password: yup.string().trim()
            .min(6, "Password must have at least 6 characters")
            .required("Password is required"),
    });

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

    // check for errors and return the errors.
    const { name, email, password } = req.body;
    try {
        // use schema to validate request
        await yupSchema.validate({
            name,
            email,
            password,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    // check for password validation error
    if (validPassword.length > 0) {
        switch (validPassword[0]) {
            case "uppercase":
                return res.status(400).json({ error: "Password must contain an UpperCase Letter" });
            case "lowercase":
                return res.status(400).json({ error: "Password must contain an LowerCase Letter" });
            case "digits":
                return res.status(400).json({ error: "Password must contain a Number" });
            case "symbols":
                return res.status(400).json({ error: "Password must contain a Special Character" });
            default:
                return res.status(400).json({ error: "Password must contain at least: 1 Capital letter & Small letter, 1 Special character and a number" });
        }
    }

    // lets make sure the app continues to the next middleware. Regardless of if there's a Validationerror
    // proceed to next middleware
    next();
}

exports.signinUserValidator = async (req, res, next) => {
    const yupSchema = yup.object().shape({
        // email validation.
        email: yup.string().trim()
            
            .required("Email is required"),

        // password validation.    
        password: yup.string().trim()
            .required("Password is required"),
    });

    // check for errors and return the errors.
    const { email, password } = req.body;
    try {
        // use schema to validate request
        await yupSchema.validate({
            email,
            password,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    // lets make sure the app continues to the next middleware. Regardless of if there's a Validationerror
    // proceed to next middleware
    next();
}