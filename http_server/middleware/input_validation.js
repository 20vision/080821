let pool = require('../config/db');
var usernameRe = /^[a-z0-9_.]{0,30}$/
var pagenameRe = /^[a-zA-Z0-9_.]{0,30}$/

//Check Username

exports.checkUniqueUsername = function(req, res, next) {
    var username = req.body.username
    if(username.length < 4){
        res.status(422).send("Username not available")
    }else{
        pool.query("SELECT if(count(user_id)>0,false,true) as uniqueUsername from User where username = ?", [username], 
        function(err, rows, fields) {
            if (err){
                res.status(500).send('An error occurred')
                console.log(err)
            }else{
                if(rows[0].uniqueUsername == true){
                    next();
                }else{
                    res.status(422).send("Username already taken")
                }
            }
        });
    }
};

exports.checkRegexUsername = function(req, res, next) {
    if(usernameRe.test(req.body.username)){
        next();
    }else{
        res.status(422).send("Usernames can only contain lowercase letters, numbers, dots and underscores")
    }
};

//Check Page

exports.checkUniquePagename = function(req, res, next) {
    var pagename = req.body.pagename.toLowerCase()
    if(pagename.length < 4){
        res.status(422).send("Pagename not available")
    }else{
        pool.query("SELECT if(count(page_id)>0,false,true) as uniquePagename from Page where unique_pagename = ?", [pagename], function(err, rows, fields) {
            try{
                if(rows[0].uniquePagename == true){
                    next();
                }else{
                    res.status(422).send("Pagename already taken")
                }
            }catch(err){
                res.status(500).send()
                throw err;
            }
        });
    }
};

exports.checkRegexPagename = function(req, res, next) {
    if(pagenameRe.test(req.body.pagename.toLowerCase())){
        next();
    }else{
        res.status(422).send("Pagenames can only contain letters, numbers, dots and underscores")
    }
};

exports.vision = function(req, res, next) {
    if((req.body.vision.length < 4) || (req.body.vision.length > 500)){
        res.status(422).send("Your Vision has to contain at least 4 characters and at most 500")
    }else{
        next();
    }
};