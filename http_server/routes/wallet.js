const router = require("express").Router();
let pool = require('../config/db');
var keys = require('../config/keys');
const jwt = require('jsonwebtoken');
const input_validation = require('../middleware/input_validation');
const nacl = require('tweetnacl');
const solanaWeb3 = require('@solana/web3.js');
const {create_user, login_user} = require('../utils/walletActions.js')


router.post("/connect", async (req, res) => {
    if(req.body.publicKey && req.body.signature){

        const signature = new Uint8Array(req.body.signature.data);
        const publicKey = new solanaWeb3.PublicKey(req.body.publicKey)
        const message = new TextEncoder().encode(`Sign this Message to verify Wallet Ownership and Log Into 20.Vision.`);

        if(nacl.sign.detached.verify(message, signature, publicKey.toBuffer())){
            pool.getConnection(function(err, conn) {
                conn.query(
                    'SELECT user_id from User where public_key = ?',
                    [publicKey.toString()],
                    async function(err, results) {
                        if (err){
                            res.status(500).send('An error occurred')
                            console.log(err)
                        }else{
                            if((results.length > 0) && !req.body.username){
                                try{
                                    const token = await login_user(req.useragent.os, conn, publicKey.toString())
                                    res.cookie('auth_token', token, {httpOnly: true, sameSite:"none", secure: true})
                                    res.status(200).send()
                                }catch(e){
                                    if(e.statusCode && e.statusMsg){
                                        res.status(e.statusCode).send(e.statusMsg)
                                    }else{
                                        res.status(400).send('An error occured')
                                    }
                                }
                            }else if((req.body.username) && (results.length == 0)){

                                try{
                                    const token = await create_user(req.useragent.os, conn, req.body.username, publicKey.toString())
                                    res.cookie('auth_token', token, {httpOnly: true, sameSite:"none", secure: true})
                                    res.status(200).send()
                                }catch(e){
                                    if(e.statusCode && e.statusMsg){
                                        res.status(e.statusCode).send(e.statusMsg)
                                    }else{
                                        res.status(400).send('An error occured')
                                    }
                                }

                            }else if((req.body.username) && (results.length > 0)){
                                res.status(422).send('An Account with this Public Key already exists')
                            }else if(!req.body.username && (results.length == 0)){
                                res.status(422).send('Missing Username')
                            }else{
                                res.status(400).send('An error occurred')
                            }
                        }
                    }
                );

                pool.releaseConnection(conn);
            })
        }else{
            res.status(401).send('Invalid Signature')
        }
    }else{
        res.status(422).send('Signature or Public Key missing')
    }
})

router.post("/check_existing", async (req, res) => {
    if(req.body.publicKey){
        let publicKey = new solanaWeb3.PublicKey(req.body.publicKey.toString())
        publicKey = publicKey.toString()
        pool.query(
            'SELECT user_id from User where public_key = ?',
            [publicKey],
            function(err, results) {
                if (err){
                    res.status(500).send('An error occurred')
                    console.log(err)
                }else{
                    if(results.length > 0){
                        res.json({
                            new: false
                        })
                    }else{
                        res.json({
                            new: true
                        })
                    }
                }
            }
        );
    }else{
        res.status(422).send('Invalid public Key')
    }
})

module.exports = router;