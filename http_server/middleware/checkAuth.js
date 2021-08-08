let pool = require('../config/db');
var keys = require('../config/keys');
const jwt = require('jsonwebtoken');

exports.optional = function(req, res, next) {
    if(req.cookies['auth_token']){
        jwt.verify(req.cookies['auth_token'], keys.JWT_SECRET, function(err, decoded) {
            if(err){
                res.clearCookie("auth_token")
                res.status(401).send('Invalid auth_token')
            }else{
                req.session_id = decoded.session_id
                pool.query(
                    'SELECT user_id FROM User_Session where session_id = ?;',
                    [decoded.session_id],
                    function(err, results) {
                        if (err){
                            res.status(500).send('An error occurred')
                            console.log(err)
                        }else{
                            if(results[0]){
                                req.user_id = results[0].user_id
                                next();
                            }else{
                                res.clearCookie("auth_token")
                                res.status(401).send('Invalid auth_token')
                            }
                        }
                    }
                );
            }
        });
    }else{
        next();
    }
}

exports.required = function(req, res, next) {
    if(req.cookies['auth_token']){
        jwt.verify(req.cookies['auth_token'], keys.JWT_SECRET, function(err, decoded) {
            if(err){
                res.clearCookie("auth_token")
                res.status(401).send('Invalid auth_token')
            }else{
                req.session_id = decoded.session_id
                pool.query(
                    'SELECT user_id FROM User_Session where session_id = ?;',
                    [decoded.session_id],
                    function(err, results) {
                        if (err){
                            res.status(500).send('An error occurred')
                            console.log(err)
                        }else{
                            if(results[0]){
                                req.user_id = results[0].user_id
                                next();
                            }else{
                                res.clearCookie("auth_token")
                                res.status(401).send('Invalid auth_token')
                            }
                        }
                    }
                );
            }
        });
    }else{
        res.status(401).send('Not authenticated')
    }
}