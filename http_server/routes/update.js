const router = require("express").Router();
const cloudStorage = require('../middleware/cloudStorage')
const check = require('../middleware/check')
const pool = require('../config/db');
const input_validation = require('../middleware/input_validation');

router.post("/profile_picture", check.AuthRequired, cloudStorage.profile_picture, async (req, res) => {
    if(!req.user_id){
        res.status(401).send('Not authenticated')
    }else if(!req.imageUrl){
        res.status(500).send('An error occured. Please try again later')
    }else{
        res.json({url: req.imageUrl})
    }
});

router.post("/username", check.AuthRequired, input_validation.checkRegexUsername, input_validation.checkUniqueUsername, async (req, res) => {
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

router.post("/forum/like", check.AuthRequired, async (req, res) => {
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
        pool.releaseConnection(conn);
    })
})


module.exports = router;