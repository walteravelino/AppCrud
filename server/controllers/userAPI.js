/**
 * Created by Arif on 15/2/20.
 */
var User = require('../models/User');
var Messages = require('../Utilities/messages');
var ObjectId = require('mongoose').Types.ObjectId;
var bcrypt = require('bcrypt');
var BCRYPT_SALT_ROUNDS = 12;

let jwt = require('jsonwebtoken');
let config = require('../../config/config');
let middleware = require('../middleware/middleware');


// METHOD  : POST
// ROUTE   : /api/registerUser
// FUNCTION: Create user
async function createUserAPI(req, res) {
    try {
        var createUser = new User(req.body);
        var checkUsername = {
            'email': req.body.auth.email
        }
        if (!req.body.auth.password) {
            req.body.auth.password = "test@123"
        }
        var userRoleCheck = await makeFirstUserAdmin()
        if (userRoleCheck.result.length == 0) {
            createUser.userType = "admin"
        }
        var userExistsRes = await getUserByUsername(checkUsername);
        if (userExistsRes.result == false) {
            let hashedPassword = await bcrypt.hash(req.body.auth.password, BCRYPT_SALT_ROUNDS)
            createUser.auth.password = hashedPassword;
            let result = await createUser.save()
            res.json({result: result, status: true});

        } else {
            userExistsRes.status = false;
            res.json(userExistsRes);
        }
    } catch (err) {
        console.log("Error saving user: ");
        console.log(err);
        throw err;
    }
}


async function getUserByUsername(req) {
    try {
        var loginDetail = {
            'auth.email': req.email
        };
        var results = await User.findOne(loginDetail)
        if (results !== null) {
            return ({result: Messages.usernameExists, status: true});
        } else {
            return ({result: false, status: false});
        }
    } catch (err) {
        throw err;
    }
}


async function makeFirstUserAdmin() {
    try {
        var role = {
            'userType': "admin"
        };
        var results = await User.find(role)
        if (results !== null) {
            return ({result: results, status: true});
        } else {
            return ({result: false, status: false});
        }
    } catch (err) {
        throw err;
    }
}


// METHOD  : POST
// ROUTE   : /api/login
// FUNCTION: loginAPI user
async function loginAPI(req, res) {
    console.log("req.body", req.body)
    var email = req.body.email
    var password = req.body.password
    try {
        var results = await User.findOne({'auth.email': email});
        if (results != null) {
            var pasmepassword = await bcrypt.compare(password, results.auth.password);
            if (pasmepassword) {
                let token = await jwt.sign({email: email, role: results.userType, id: results._id},
                    config.secret,
                    {
                        expiresIn: '24h' // expires in 24 hours
                    }
                );
                res.json({
                    result: results,
                    status: true,
                    message: 'Authentication successful!',
                    token: token
                });
                console.log("Authentication successful!")
            } else {
                res.json({
                    result: Messages.userOrPasswordWrong,
                    status: false
                });
            }
        } else {
            res.json({
                result: Messages.userNotRegister,
                status: false
            });
        }

    } catch (err) {
        console.log("err---------------", err)
        throw err;
    }
}


// METHOD  : GET
// ROUTE   : /api/listOfUser
// FUNCTION: Get all users

async function listOfUserAPI(req, res, next) {
    console.log("listOfUserAPI CALLING")
    console.log("----------", res.roledata)
    //console.log("--11111--------",roledata)
    try {
        var query = {};
        if (res.roledata.role == "user") {
            console.log("3322222222222222222", res.roledata.role)
            // query = res.roledata.id
            query._id = new ObjectId(res.roledata.id)
        }
        // Find and sort users with creating time
        console.log("query----------", query)
        const results = await User.find(query).sort([['createdAt', -1]]);
        res.json({result: results, status: true});
    } catch (err) {
        console.log('ERROR IN listOfUserAPI', err);
        console.log(err.message);
    }
};

// METHOD  : GET
// ROUTE   : /api/listOfUser/:id
// FUNCTION: Fetch a User

async function getUserById(req, res) {
    console.log("req.body", req)
    console.log("param", req.params.id)
    console.log("getUserById")
    try {
        const results = await User.findById(req.params.id);
        res.json({result: results, status: true});
    } catch (err) {
        console.log('ERROR IN getUserById');
        console.log(err.message);
    }
};


// METHOD  : DELETE
// ROUTE   : /api/delete/:id
// FUNCTION: Delete the User
async function deletetUserById(req, res) {
    try {
        const results = await User.findByIdAndDelete(req.params.id);
        console.log("results----------", results)
        res.json({result: results, status: true});
    } catch (err) {
        console.log('ERROR IN deletetUserById');
        console.log(err.message);
    }


}


async function updateUser(req, res) {
    console.log("req.body._id-----------", req.body.updateQuery.dob)
    try {
        var query = {};
        var updateObj = {}
        if (req.body.updateQuery) {
            query._id = new ObjectId(req.body.updateQuery._id)
            if (req.body.updateQuery.name) {
                updateObj.name = req.body.updateQuery.name
            }
            if (req.body.updateQuery.email) {
                updateObj["auth.email"] = req.body.updateQuery.email
            }
            if (req.body.updateQuery.mobile) {
                updateObj.mobile = req.body.updateQuery.mobile
            }
            if (req.body.updateQuery.url) {
                updateObj.url = req.body.updateQuery.url
            }
            if (req.body.updateQuery.gender) {
                updateObj.gender = req.body.updateQuery.gender
            }
            if (req.body.updateQuery.dob) {
                updateObj.dob = req.body.updateQuery.dob
            }
            if (req.body.updateQuery.desc) {
                updateObj.desc = req.body.updateQuery.desc
            }
        }

        console.log("updateObj", {$set: updateObj})
        console.log("Query", query)
        var results = await User.updateOne(query, {$set: updateObj})
        console.log("results---------", results)
        res.json({result: results, status: true});


    } catch (err) {
        console.log('[ERROR]');
        console.log(err.message);
    }
};


module.exports.createUser = createUserAPI;
module.exports.listOfUser = listOfUserAPI;
module.exports.loginAPI = loginAPI;
module.exports.getUserById = getUserById;
module.exports.deletetUserById = deletetUserById;
module.exports.updateUser = updateUser;
