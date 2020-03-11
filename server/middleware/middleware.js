let jwt = require('jsonwebtoken');
const config = require('../../config/config');

let checkToken = async(req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    // if (token.startsWith('Bearer ')) {
    //     // Remove Bearer from string
    //     token = token.slice(7, token.length);
    // }
    try {
        if (token) {
            var decoded = await jwt.verify(token, config.secret)
             console.log("decoded---------",decoded)
                if (!decoded) {
                    return res.json({
                        success: false,
                        message: 'Token is not valid'
                    });
                } else {
                    //console.log("decoded----------",decoded)
                    req.decoded = decoded;
                    res.roledata = decoded
                    next();
                }

        } else {
            return res.json({
                success: false,
                message: 'Auth token is not supplied'
            });
        }
    }catch (err) {
        console.log("err-----------------",err.message)
        return res.json({
            success: false,
            message: 'Token is not valid'
        });
      throw err
    }
};

module.exports = {
    checkToken: checkToken
}