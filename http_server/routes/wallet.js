const router = require("express").Router();
let pool = require('../config/db');
var keys = require('../config/keys');
const jwt = require('jsonwebtoken');
const input_validation = require('../middleware/input_validation');
const nacl = require('tweetnacl');
const { random_string } = require("../config/random");
const solanaWeb3 = require('@solana/web3.js');

router.post("/verification", async (req, res) => {
    if(req.body.publicKey){
        pool.getConnection(function(err, conn) {
            conn.query(
                'SELECT messageKey from Verify_PublicAddress where publicKey = ?;',
                [req.body.publicKey],
                async function(err, results) {
                    if (err) throw err
                    if(results.length == 0){
                        const randomMessageKey = await random_string(8)
                        conn.query(
                            'INSERT INTO Verify_PublicAddress values (?,?,now());',
                            [req.body.publicKey, randomMessageKey, null],
                            function(err, results) {
                                if (err){
                                    res.status(500).send('An error occurred')
                                    console.log(err)
                                }else{
                                    res.json({
                                        key: randomMessageKey
                                    })
                                }
                            }
                        );
                    }else{
                        res.json({
                            key: results[0].messageKey
                        })
                    }
                }
            );
            pool.releaseConnection(conn);
        })
    }else{
        res.status(422).send('Public Key Missing')
    }
});

// Sending wallet "public key" as user_id and checking if user already in db -> send cookie. If not -> return new
router.post("/connect", async (req, res) => {
    if(req.body.signature && req.body.publicKey){
        const publicKeyString = req.body.publicKey.toString()
        const signature = new Uint8Array(req.body.signature.data);
        const publicKey = new solanaWeb3.PublicKey(req.body.publicKey)
        pool.getConnection(function(err, conn) {
            conn.query(
                'SELECT messageKey from Verify_PublicAddress where publicKey = ?;',
                [publicKeyString],
                function(err, results) {
                    if (err){
                        res.status(500).send('An error occurred')
                        console.log(err)
                    }else if(results.length > 0){
                        const message = `Sign this Message to Confirm Ownership and Log Into 20.Vision. session id: ${results[0].messageKey}`
                        const unit8Message = new TextEncoder().encode(message);
                        if(nacl.sign.detached.verify(unit8Message, signature, publicKey.toBuffer())){
                            conn.query(
                                'SELECT user_id from User where public_address = ?',
                                [publicKeyString],
                                function(err, results) {
                                    if (err) throw err
                                    console.log(results)
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
                                                    conn.query(
                                                        'DELETE from Verify_PublicAddress where publicKey = ?',
                                                        [publicKeyString],
                                                        function(err, resultsDeletion) {
                                                            if (err){
                                                                res.status(500).send('An error occurred')
                                                                console.log(err)
                                                            }else{
                                                                var token = jwt.sign({session_id: results.insertId}, keys.JWT_SECRET);
                                                                res.cookie('auth_token', token, {httpOnly: true, sameSite:"none", secure: true})
                                                                res.json({
                                                                    new: false
                                                                })
                                                            }
                                                        }
                                                    );
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }else{
                            res.status(401).send('Invalid Signature')
                        }
                    }else{
                        res.status(422).send('No key found')
                    }
                }
            );
            pool.releaseConnection(conn);
        })

    }else{
        res.status(422).send()
    }
});


router.post("/create", input_validation.checkRegexUsername, input_validation.checkUniqueUsername, async (req, res) => {
    const publicKeyString = req.body.publicKey.toString()

    pool.getConnection(function(err, conn) {
        conn.query(
            'INSERT INTO User values (?,?,?,?,now());',
            [null, publicKeyString, req.body.username, null, null],
            function(err, results) {
                if (err){
                    res.status(500).send('An error occurred')
                    console.log(err)
                }else{
                    conn.query(
                        'INSERT INTO User_Session values (?,?,INET_ATON(?),?,now());',
                        [null, results.insertId, '127.0.0.1', req.useragent.os, null],
                        function(err, results) {
                            if (err){
                                res.status(500).send('An error occurred')
                                console.log(err)
                            }else{
                                conn.query(
                                    'DELETE from Verify_PublicAddress where publicKey = ?',
                                    [publicKeyString],
                                    function(err, resultsDeletion) {
                                        if (err){
                                            res.status(500).send('An error occurred')
                                            console.log(err)
                                        }else{
                                            var token = jwt.sign({session_id: results.insertId}, keys.JWT_SECRET);
                                            res.cookie('auth_token', token, {httpOnly: true, sameSite:"none", secure: true})
                                            res.json({
                                                new: false
                                            })
                                        }
                                    }
                                );
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