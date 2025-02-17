let pool = require('../config/db');
var keys = require('../config/keys');
var passwords = require('../config/passwords')
const jwt = require('jsonwebtoken');
const { PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');
const bs58 = require('bs58')

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

exports.DevMode = function(req, res, next){
    if(passwords.express != 'password') return res.status(422).send('Not allowed')
    next()
}

exports.LastDelivered = function(req, res, next) {
    if(req.cookies['delivered']) req.lastDelivered = req.cookies['delivered']
    res.cookie('delivered', Date.now(), {httpOnly: true, sameSite:"none", secure: true})
    next()
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
    if((req.params.page_name == null) && (req.body.pagename == null)) {
        return res.status(422).send('Pagename missing')
    }
    req.pagename = req.params.page_name?req.params.page_name:req.body.pagename?req.body.pagename:null
    pool.query(
        'SELECT pu.page_id FROM PageUser pu join Page p on p.page_id = pu.page_id and pu.user_id = ? and p.unique_pagename = ?;',
        [req.user_id, req.pagename],
        function(err, results) {
            if (err){
                res.status(500).send('An error occurred')
                console.log(err)
            }else{
                if(results[0] && (results[0].page_id != null)){
                    req.page_id = results[0].page_id
                    next();
                }else{
                    res.status(403).send('Permission denied')
                }
            }
        }
    );
}

exports.componentAuth = function(req, res, next) {
    if(req.query.component_uid && req.query.mission_title && req.query.page_name){
        pool.query(
            'SELECT pu.role, pa.component_id from PageUser pu join Mission m on pu.page_id = m.page_id and pu.user_id = ? join component pa on pa.mission_id = m.mission_id and pa.uid = ? and m.title = ? join Page p on pu.page_id = p.page_id and p.unique_pagename = ?;',
            [req.user_id, req.query.component_uid, req.query.mission_title, req.query.page_name],
            function(err, results) {
                if (err){
                    res.status(500).send('An error occurred')
                    console.log(err)
                }else{
                    if(results[0] && results[0].role && (results[0].role >= 0) && results[0].component_id){
                        req.component_id = results[0].component_id
                        next();
                    }else{
                        res.status(403).send('Permission denied')
                    }
                }
            }
        );
    }else if(req.query.mission_title && req.query.page_name){
        pool.query(
            'SELECT pu.role, m.mission_id from PageUser pu join Page p on pu.page_id = p.page_id and pu.user_id = ? and p.unique_pagename = ? join Mission m on p.page_id = m.page_id and m.title = ?;',
            [req.user_id, req.query.page_name, req.query.mission_title],
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


exports.fundTransaction = function(req, res, next) {
    let tx = Transaction.from(req.body.tx.data)

    let txSignatures = tx.signatures

    let txInstructionData = tx.instructions[0].data
    let txInstructionKeys = tx.instructions[0].keys
    let txInstructionProgramId = tx.instructions[0].programId

    if(txInstructionData[0] != 0){
        return res.status(422).send('Invalid Instruction Data');
    }
    if (txInstructionProgramId.toString() != '969cdvMTsXAs2QfCFvGb2TmaR9gbFvMjRfG8u5v1if3d'){
        return res.status(422).send('Invalid Program Id');
    }


    // PubKeys
        let payer = txInstructionKeys[0].pubkey.toString()
        let new_mint = txInstructionKeys[1].pubkey.toString()
        let pda = txInstructionKeys[2].pubkey.toString()
        let pda_associated_sol = txInstructionKeys[3].pubkey.toString()
        let fee_collector = txInstructionKeys[4].pubkey.toString()
        let system_program = txInstructionKeys[5].pubkey.toString()
        let token_program = txInstructionKeys[6].pubkey.toString()
        let rent_sysvar = txInstructionKeys[7].pubkey.toString()

    let payerSignature = txSignatures[0].publicKey.toString()
    let mintSignature = txSignatures[1].publicKey.toString()

    if((tx.feePayer.toString() != payerSignature) && (payerSignature != payer)){
        return res.status(422).send('Invalid Payer Info')
    }
    if(mintSignature != new_mint){
        return res.status(422).send('Invalid Mint Info')
    }
    if(system_program.toString()!= '11111111111111111111111111111111'){
        return res.status(422).send('Invalid System Program Id')
    }
    if(token_program.toString()!= 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'){
        return res.status(422).send('Invalid Token Program Id')
    }
    if(rent_sysvar.toString()!= 'SysvarRent111111111111111111111111111111111'){
        return res.status(422).send('Invalid Rent Sysvar Id')
    }

    pool.query(
        'SELECT p.token_mint_address, pu.role from PageUser pu join Page p on p.page_id=pu.page_id and p.unique_pagename = ? join User u on pu.user_id=u.user_id and public_key = ?;',
        [req.body.unique_pagename, fee_collector],
        function(err, results) {
            if (err){
                console.log(err)
                return res.status(500).send('An Error Occurred')
            }else{
                if(!results || !results[0]){
                    return res.status(404).send('Page Not Found')
                }
                if(results[0].role != 1){
                    return res.status(422).send('Invalid Fee Collector')
                }
                if(results[0].token_mint_address != null){
                    return res.status(422).send('Token has already been funded')
                }
                req.mint = new_mint;
                next()
            }
        }
    );
}