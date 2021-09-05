let pool = require('../config/db');
var keys = require('../config/keys');
const jwt = require('jsonwebtoken');

exports.AuthOptional = function(req, res, next) {
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

exports.AuthRequired = function(req, res, next) {
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


exports.role = function(req, res, next) {
    if(req.query.role){
        pool.query(
            'SELECT pu.role FROM PageUser pu join Page p on p.page_id = pu.page_id and pu.user_id = ? and p.unique_pagename = ?;',
            [req.user_id, req.params.page_name],
            function(err, results) {
                if (err){
                    res.status(500).send('An error occurred')
                    console.log(err)
                }else{
                    if(results[0] && results[0].role && (results[0].role >= parseInt(req.query.role))){
                        next();
                    }else{
                        res.status(403).send('Permission denied')
                    }
                }
            }
        );
    }else{
        next();
    }
}

exports.paperAuth = function(req, res, next) {
    if(req.query.paper_uid){
        /*pool.query(
            'SELECT p.page_id from Page p join Mission m on m.page_id = p.page_id join PageUser pu on pu.page_id = p.page_id and pu.user_id = ? join Paper pa on pa.mission_id = m.mission_id and pa.uid = ?',
            [req.user_id, req.query.paper_uid],
            function(err, results) {
                if (err){
                    res.status(500).send('An error occurred')
                    console.log(err)
                }else{
                    if(results[0] && results[0].role && (results[0].role >= parseInt(req.query.role))){
                        next();
                    }else{
                        res.status(403).send('Permission denied')
                    }
                }
            }
        );*/
    }else if(req.query.mission_title && req.query.page_name){
        pool.query(
            'SELECT pu.role, m.mission_id from PageUser pu join Page p on pu.page_id = p.page_id and pu.user_id = ? join Mission m on p.page_id = m.page_id and m.title = ? and p.unique_pagename = ?;',
            [req.user_id, req.query.mission_title, req.query.page_name],
            function(err, results) {
                if (err){
                    res.status(500).send('An error occurred')
                    console.log(err)
                }else{
                    if(results[0] && results[0].role && (results[0].role >= 0) && results[0].mission_id){
                        req.mission_id = results[0].mission_id
                        next();
                    }else{
                        res.status(403).send('Permission denied')
                    }
                }
            }
        );
    }else{
        res.status(400).send('no parent')
    }
}