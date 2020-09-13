const _ = require('lodash');

const usersModel = require('../models/usersdb');

exports.attachProfile = (req, res, next, id) => {
    // find user with the _id
    usersModel.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.status(401).json({ error: "You are not authorized to view this page. N-F" });
        }

        // add user to a new param profile in the request
        req.profile = user;
        
        next();
    })
}

exports.getAllUsers = (req, res) => {
    usersModel.find((err, users) => {
        if(err || !users) return res.status(400).json({ error: "An error was encountered" });

        res.json(users);
    }).select("name email created updated");
}

exports.findUser = (req, res) => {
    req.profile.password = undefined;
    return res.json(req.profile);
}

exports.updateUser = (req, res) => {
    let user = req.profile;
    
    //const request = req.body.
    let request = req.body;

    // trim all incoming update requests
    Object.keys(request).map((v, i) => {
        request[v] = request[v].trim();
    })

    // make sure user email cannot be updated
    if(request.email && request.email !== user.email) return res.status(400).json({ error: "Email cannot be changed!" })

    // make sure user cannot update password through this route
    if(request.password) return res.status(401).json({ error: "Password cannot be changed here!" })

    // use lodash extend method to replace the changed values in user
    user = _.extend(user, request);

    // set new updated date in user
    user.updated = Date.now();

    // save updated user in db.
    user.save().then(updatedUser => {
        return res.json({ message: "Update Successful!" });
    }).catch(error => {
        return res.status(400).json({ error: "Error: Action cannot be completed", error })
    })
}

exports.deleteUser = (req, res) => {
    const request = req.profile;

    request.remove().then(deletedUser => {
        if(deletedUser) return res.json({ message: "Your account has been deleted successfully!" })
    }).catch(error => {
        return res.status(400).json({ error: "An error was encountered while " })
    })
}
