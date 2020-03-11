/**
 * Created by Arif on 15/2/20.
 */
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = mongoose.model('User',{
    name: {type: String,required: true},
    auth : {
        email: {type: String},
        password: {type: String}
    },
    url : {type: String},
    gender : {type: String},
    dob : {type: String},
    userType : {type: String,default:"user"},
    desc : {type: String},
    status : {type: String,default:"active"},
    mobile : {type: Number},
    updatedAt : {type: Date},
    createdDate: {type: Date, require: true, default: Date.now}
});

