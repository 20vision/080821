let pool = require('../config/db');
const usernameRe = /^[a-z0-9_.]{0,30}$/
const pagenameRe = /^[a-zA-Z0-9_.]{0,30}$/
const hexRegex = /^([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/ //Without #
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
        res.status(422).send("Your Vision has to contain at least 4 and at most 500 characters")
    }else{
        next();
    }
};

exports.checkUniqueTopicTitle = function(req, res, next) {
    if(req.params.topic_title){
        req.topic_title = req.params.topic_title
    }else if(req.body.topicTitle){
        req.topic_title = req.body.topicTitle
    }
    if(req.params.pagename){
        req.pagename = req.params.pagename
    }else if(req.body.pagename){
        req.pagename = req.body.pagename
    }

    pool.query("SELECT if(count(t.topic_id)>0,false,true) as uniqueTopic from Topic t join Page p on p.page_id = t.page_id where t.name = ? and p.unique_pagename = ?", 
    [req.topic_title, req.pagename], 
    function(err, rows, fields) {
        try{
            if(rows[0].uniqueTopic == true){
                next();
            }else{
                res.status(422).send("Mission Title already taken")
            }
        }catch(err){
            res.status(500).send()
            throw err;
        }
    });
}

exports.checkUniqueMissionTitle = function(req, res, next) {
    if(req.params.mission_title){
        req.mission_title = req.params.mission_title
    }else if(req.body.missionTitle){
        req.mission_title = req.body.missionTitle
    }
    if(req.params.pagename){
        req.pagename = req.params.pagename
    }else if(req.body.pagename){
        req.pagename = req.body.pagename
    }

    req.mission_title = req.mission_title.replace(/ /g, '_');
    pool.query("SELECT if(count(m.mission_id)>0,false,true) as uniqueMission from Mission m join Page p on p.page_id = m.page_id where m.title = ? and p.unique_pagename = ?", 
    [req.mission_title, req.pagename], 
    function(err, rows, fields) {
        try{
            if(rows[0].uniqueMission == true){
                next();
            }else{
                res.status(422).send("Mission Title already taken")
            }
        }catch(err){
            res.status(500).send()
            throw err;
        }
    });
};

exports.missionBody_topicBody_forumPost = function(req, res, next) {
    let content = 
    req.body.missionBody?
        req.body.missionBody
    :req.body.forum_post?
        req.body.forum_post
    :req.body.topicBody?
        req.body.topicBody
    :
        null

    if(!content || (content.length < 1) || (content.length > 280)){
        res.status(422).send("Your Mission has to contain 280 characters at most")
    }else{
        next();
    }
};

exports.hex_color = function(req, res, next){
    if(!hexRegex.test(req.body.hex_color)){
        console.log(req.body.hex_color)
        res.status(422).send("Invalid Color")
    }else{
        next()
    }
}