const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const usersModel = require('../models/usersdb');

const saltRounds = 10;

exports.signup = async (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
        // check for error while hashing
        if(err) console.log(err);

        // check if user email exists and return an error message if it does 
        const userExists = await usersModel.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(403).json({
                error: "User Already exists",
            });
        }

        // replace plain password with the hashed password
        req.body.password = hash;

        // save user in db and respond
        const user = new usersModel(req.body);
        user.save()
            .then(result => {
                return res.json({
                    message: "Registration Successful! Please login now.",
                    user,
                })
            })
            .catch(error => {
                return console.log(error);
            })
    });
}

exports.signin = (req, res) => {
    const { email, password } = req.body;
    
    // find the user email first
    usersModel.findOne({ email: email }, (err, user) => {
        // check if user does not exist
        if(err || !user) {
            return res.status(401).json({error: "Wrong login details. Please try again"});
        }

        // compare password with hashed password in the db
        bcrypt.compare(password, user.password).then(result => {
            if(result !== true) {
               return res.status(401).json({error: "Wrong login details. Please try again"});
            } else if (result === true) {
                // create a json web token
                jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
                    // always check for errors first
                    if(err) return console.log(err);

                    // send jwt as a cookie to be saved in the browser. Using the help of cookie-parser
                    res.cookie("tk", token, { expire: new Date() + 9999 });

                    // send the normal login successful and the token and user details
                    const { _id, name, email } = user;
                    return res.json({
                        message: "Login Successful",
                        token,
                        user: {
                            _id,
                            name,
                            email,
                        },
                    })
                })
            }
        })

    })
}

exports.signout = (req, res) => {
    res.clearCookie("tk");
    return res.json({ message: "Sign Out Successful!" });
}

exports.requireSignin = (req, res, next) => {
    // get token from the request header
    const token = req.header('Authorization');
    
    // check if token was given in header
    if(!token) return res.status(401).json({ error: "You are not authorized to view this page!" });
    
    // verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        //check for invalid token
        if(err) return res.status(401).json({ error: "You are not authorized to view this page!" })
    })

    next();
}
