var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
let middleware = require('./server/middleware/middleware');

var userAPI = require("./server/controllers/userAPI.js");

var cors = require('cors')
app.use(cors())
app.options('*', cors())

app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded

app.use(bodyParser.json());
var allowCrossDomain = function(req, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
};
app.use(allowCrossDomain);



var database = mongoose.connect('mongodb://localhost:27017/userapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
console.log("database connected")


app.get('/', function (req, res) {
    res.sendfile(__dirname + '/client/views/index.html');
})

app.use("/js", express.static(__dirname + '/client/js'));

app.post('/api/registerUser',userAPI.createUser);
app.post('/api/login',userAPI.loginAPI);
app.get('/api/list/users', middleware.checkToken,userAPI.listOfUser );
app.get('/api/list/user/:id',middleware.checkToken,userAPI.getUserById);
app.delete('/api/delete/:id',middleware.checkToken,userAPI.deletetUserById);
app.put('/api/updateUser',middleware.checkToken,userAPI.updateUser);



module.exports = app;

app.listen(5000, function () {
    console.log("Welcome to UserApp.. server started at 5000")
})



