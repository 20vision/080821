const router = require("express").Router();
const cloudStorage = require('../middleware/cloudStorage')
const check = require('../middleware/check')
const pool = require('../config/db');
const input_validation = require('../middleware/input_validation');
const { deleteFile } = require("../config/storage");

router.post("/page_picture/:page_name", check.AuthRequired, check.role, check.DevMode, cloudStorage.profile_picture, async (req, res) => {
    if(!req.user_id){
        res.status(401).send('Not authenticated')
    }else if(!req.imageUrl){
        res.status(500).send('An error occured. Please try again later')
    }else{
        pool.getConnection(function(err, conn) {
            if (err){
                res.status(500).send('An error occurred')
                console.log(err)
            }else{
                conn.query(
                    'SELECT page_icon from Page where unique_pagename = ?;',
                    [req.params.page_name],
                    function(err, oldProfilePicture) {
                        if (err){
                            res.status(500).send('An error occurred')
                            console.log(err)
                        }else{
                            conn.query(
                                'UPDATE Page set page_icon=? where unique_pagename=?;',
                                [req.imageUrl, req.params.page_name],
                                async function(err, results) {
                                    if (err){
                                        res.status(500).send('An error occurred')
                                        console.log(err)
                                    }
                                    if(oldProfilePicture[0].page_icon && oldProfilePicture[0].page_icon.length > 6){
                                        try{
                                            oldProfilePicture = oldProfilePicture[0].page_icon
                                            oldProfilePicture = oldProfilePicture.split("/")
                                            let delData ={
                                                bucketname: oldProfilePicture[0],
                                                timefolder: oldProfilePicture[1],
                                                randomfolder: oldProfilePicture[2]
                                            }
                                            await deleteFile(delData)
                                            res.json({url: req.imageUrl})
                                        }catch(error){
                                            throw error
                                        }
                                    }else{
                                        res.json({url: req.imageUrl})
                                    }
                                    
                                }
                            );
                        }
                    }
                );
            }
            pool.releaseConnection(conn);
        })
    }
});

router.post("/profile_picture", check.AuthRequired, check.DevMode, cloudStorage.profile_picture, async (req, res) => {
    if(!req.user_id){
        res.status(401).send('Not authenticated')
    }else if(!req.imageUrl){
        res.status(500).send('An error occured. Please try again later')
    }else{
        pool.getConnection(function(err, conn) {
            if (err){
                res.status(500).send('An error occurred')
                console.log(err)
            }else{
                conn.query(
                    'SELECT profilePicture from User where user_id=?;',
                    [req.user_id],
                    function(err, oldProfilePicture) {
                        if (err){
                            res.status(500).send('An error occurred')
                            console.log(err)
                        }else{
                            conn.query(
                                'UPDATE User set profilePicture=? where user_id=?;',
                                [req.imageUrl, req.user_id],
                                async function(err, results) {
                                    if (err){
                                        res.status(500).send('An error occurred')
                                        console.log(err)
                                    }
                                    if(oldProfilePicture[0].profilePicture){
                                        try{
                                            oldProfilePicture = oldProfilePicture[0].profilePicture
                                            oldProfilePicture = oldProfilePicture.split("/")
                                            let delData ={
                                                bucketname: oldProfilePicture[0],
                                                timefolder: oldProfilePicture[1],
                                                randomfolder: oldProfilePicture[2]
                                            }
                                            await deleteFile(delData)
                                            res.json({url: req.imageUrl})
                                        }catch(error){
                                            throw error
                                        }
                                    }else{
                                        res.json({url: req.imageUrl})
                                    }
                                    
                                }
                            );
                        }
                    }
                );
            }
            pool.releaseConnection(conn);
        })
    }
});

router.post("/username", check.AuthRequired, check.DevMode, input_validation.checkRegexUsername, input_validation.checkUniqueUsername, async (req, res) => {
    if(req.user_id){
        pool.query(
            'UPDATE User set username = ? where user_id = ?;',
            [req.body.username,req.user_id],
            function(err, results) {
                if (err){
                    res.status(500).send('An error occurred')
                    console.log(err)
                }else{
                    res.status(200).send()
                }
            }
        );
    }else{
        res.status(401).send('Not Authenticated')
    }

})

router.post("/forum/like", check.AuthRequired, check.DevMode, async (req, res) => {
    if(!req.body.forumpost_id || !Number.isInteger(req.body.forumpost_id)){
        console.log(req.body.forumpost_id)
        return res.status(422).send('invalid post id')
    }
    pool.getConnection(async function(err, conn) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            conn.query(
                `SELECT fp.user_id from ForumPost fp where fp.forumpost_id = ?;`,
                [req.body.forumpost_id],
                function(err, check_owner) {
                    if (err){
                        console.log(err)
                        res.status(500).send('An error occurred')
                    }else{
                        if(check_owner[0].user_id == req.user_id){
                            pool.releaseConnection(conn);
                            res.status(422).send('User owns post')
                            return
                        }
                        
                        conn.query(
                            `SELECT forum_post_like_id from ForumPost_Like where forumpost_id = ? and user_id = ?;`,
                            [req.body.forumpost_id, req.user_id],
                            function(err, like) {
                                if (err){
                                    console.log(err)
                                    res.status(500).send('An error occurred')
                                }else{
                                    if(like.length > 0){
                                        conn.query(
                                            `DELETE from ForumPost_Like where forumpost_id = ? and user_id = ?;`,
                                            [req.body.forumpost_id, req.user_id],
                                            function(err, like) {
                                                if (err){
                                                    console.log(err)
                                                    res.status(500).send('An error occurred')
                                                }else{
                                                    res.status(200).send()
                                                }
                                            }
                                        );
                                    }else{
                                        conn.query(
                                            `INSERT into ForumPost_Like values(?,?,?,now());`,
                                            [null,req.user_id, req.body.forumpost_id],
                                            function(err, like) {
                                                if (err){
                                                    console.log(err)
                                                    res.status(500).send('An error occurred')
                                                }else{
                                                    res.status(200).send()
                                                }
                                            }
                                        );
                                    }
                                }
                            }
                        );
                    }
                }
            );
        }
        pool.releaseConnection(conn);
    })
})

router.post("/component/save", check.AuthRequired, check.DevMode, async (req, res) => {
    if(req.user_id){
        pool.getConnection(function(err, conn) {
            if (err){
                res.status(500).send('An error occurred')
                console.log(err)
            }else{
                conn.query(
                    'SELECT component_id from Component where uid = ?;',
                    [req.body.uid],
                    function(err, results) {
                        if (err){
                            res.status(500).send('An error occurred')
                            console.log(err)
                        }else if(results.length == 1){
                            conn.query(
                                'DELETE from UserComponentSave where component_id = ? and user_id = ?;',
                                [results[0].component_id, req.user_id],
                                function(err, results) {
                                    if (err) throw err
                                    res.status(200).send()
                                }
                            );
                        }else{
                            res.status(403).send('Component not found')
                        }
                    }
                );
            }
            pool.releaseConnection(conn);
        })
    }else{
        res.status(401).send('Not authenticated')
    }
});

router.post("/component/delete", check.AuthRequired, check.DevMode, async (req, res) => {
    if(req.user_id){
        pool.getConnection(function(err, conn) {
            if (err){
                res.status(500).send('An error occurred')
                console.log(err)
            }else{
                conn.query(
                    `SELECT c.component_id from Component c
                    join Mission m on m.mission_id = c.mission_id
                    join Page p on p.page_id = m.page_id
                    join PageUser pu on pu.page_id = p.page_id and pu.user_id = ?
                    where c.uid = ?;`,
                    [req.user_id, req.body.uid],
                    function(err, results) {
                        if (err){
                            res.status(500).send('An error occurred')
                            console.log(err)
                        }else if(results.length == 1){
                            conn.query(
                                'DELETE from Component where component_id = ?;',
                                [results[0].component_id, req.user_id],
                                function(err, results) {
                                    if (err) throw err
                                    res.status(200).send()
                                }
                            );
                        }else{
                            res.status(403).send('Component not found')
                        }
                    }
                );
            }
            pool.releaseConnection(conn);
        })
    }else{
        res.status(401).send('Not authenticated')
    }
});

router.post("/component/connection", check.AuthRequired, check.DevMode, async (req, res) => {
    if(req.user_id){
        pool.getConnection(function(err, conn) {
            if (err){
                res.status(500).send('An error occurred')
                console.log(err)
            }else{
                console.log(req.body.child_uids)
                if(req.body.child_uids && (req.body.child_uids.length > 0)){
                    for(var i = 0;i<req.body.child_uids.length;i++){
                        conn.query(
                            `SELECT c.component_id as component_id, c1.component_id as child_component_id from Component c
                            join Mission m on m.mission_id = c.mission_id
                            join Page p on p.page_id = m.page_id
                            join PageUser pu on pu.page_id = p.page_id and pu.user_id = ?
                            join ComponentConnection cc on cc.component_id = c.component_id 
                            join Component c1 on c1.component_id = cc.child_component_id
                            where c.uid = ? and c1.uid = ?`,
                            [req.user_id, req.body.uid, req.body.child_uids[i]],
                            function(err, results) {
                                console.log(results)
                                if (err){
                                    res.status(500).send('An error occurred')
                                    throw err
                                }else if(results.length == 1){
                                    conn.query(
                                        'DELETE from ComponentConnection where component_id = ? and child_component_id = ?;',
                                        [results[0].component_id, results[0].child_component_id],
                                        function(err, results) {
                                            if (err) throw err
                                        }
                                    );
                                }else{
                                    res.status(403).send('Component not found')
                                    throw new Error('Comp not found or not Authorized')
                                }
                            }
                        );   
                    }
                    res.status(200).send()
                }else{
                    res.status(422).send('')
                }
            }
            pool.releaseConnection(conn);
        })
    }else{
        res.status(401).send('Not authenticated')
    }
});


module.exports = router;