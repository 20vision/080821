const router = require("express").Router();
let pool = require('../config/db');
var keys = require('../config/keys');
const jwt = require('jsonwebtoken');
const input_validation = require('../middleware/input_validation');

// Sending wallet "public key" as user_id and checking if user already in db -> send cookie. If not -> return new
router.post("/connect", async (req, res) => {
    pool.getConnection(function(err, conn) {
        conn.query(
            'SELECT user_id from User where user_id = ?',
            [req.body.user_id],
            function(err, results) {
                if (err) throw err
                if(results.length == 0){
                    res.json({
                        new: true
                    })
                }else{
                    conn.query(
                        'INSERT INTO User_Session values (?,?,INET_ATON(?),?,now());',
                        [null, req.body.user_id, '127.0.0.1', req.useragent.os, null],
                        function(err, results) {
                            if (err){
                                res.status(500).send('An error occurred')
                                console.log(err)
                            }else{
                                var token = jwt.sign({session_id: results.insertId}, keys.JWT_SECRET);
                                res.cookie('auth_token', token, {httpOnly: true})
                                res.json({
                                    new: false
                                })
                            }
                        }
                    );
                }
            }
        );
        pool.releaseConnection(conn);
    })
});


router.post("/create", input_validation.checkRegexUsername, input_validation.checkUniqueUsername, async (req, res) => {
    pool.getConnection(function(err, conn) {
        conn.query(
            'INSERT INTO User values (?,?,?,now());',
            [req.body.user_id, req.body.username, null, null],
            function(err, results) {
                if (err){
                    res.status(500).send('An error occurred')
                    console.log(err)
                }else{
                    conn.query(
                        'INSERT INTO User_Session values (?,?,INET_ATON(?),?,now());',
                        [null, req.body.user_id, '127.0.0.1', req.useragent.os, null],
                        function(err, results) {
                            if (err){
                                res.status(500).send('An error occurred')
                                console.log(err)
                            }else{
                                var token = jwt.sign({session_id: results.insertId}, keys.JWT_SECRET);
                                res.cookie('auth_token', token, {httpOnly: true})
                                res.status(200).send()
                            }
                        }
                    );
                }
            }
        );
        pool.releaseConnection(conn);
    })

});

module.exports = router;