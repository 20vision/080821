const router = require("express").Router();
const check = require('../middleware/check')
const input_validation = require('../middleware/input_validation')
let pool = require('../config/db');
const cloudStorage = require('../middleware/cloudStorage');
const { sendAndConfirmRawTransaction, Connection } = require("@solana/web3.js");

const colorOptions = [
    '7dbef5', '097bdc', '2dc3bc', '70908e', '67c166', '189c3b', 'c3c52e', 'd28e2a', 'dcb882', 'af9877', 'd64675', 'bb82c5', 'ac34c1', '9778bf', 'bf1402'
]

router.post("/create_page", check.AuthRequired, input_validation.checkRegexPagename, input_validation.checkUniquePagename, input_validation.vision, async (req, res) => {
    if(req.user_id){
        pool.getConnection(function(err, conn) {
            if (err){
                res.status(500).send('An error occurred')
                console.log(err)
            }else{
                var page_color = colorOptions[Math.floor(Math.random() * colorOptions.length)]
                conn.query(
                    'INSERT INTO Page values (?,?,?,?,?,?,now());',
                    [null, page_color, req.body.pagename, req.body.pagename.toLowerCase(), req.body.vision, null, null],
                    function(err, results) {
                        if (err){
                            res.status(500).send('An error occurred')
                            console.log(err)
                        }else{
                            conn.query(
                                'INSERT INTO PageUser values (?,?,?,?,now(),now());',
                                [null, req.user_id, results.insertId, 1, null, null],
                                function(err, results) {
                                    if (err) throw err
                                    res.json({page_icon: page_color})
                                }
                            );
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

router.post("/mission", check.AuthRequired, check.role, input_validation.checkUniqueMissionTitle, input_validation.missionBody, async (req, res) => {
    if(req.user_id){
        pool.getConnection(function(err, conn) {
            if (err){
                res.status(500).send('An error occurred')
                console.log(err)
            }else{
                conn.query(
                    'SELECT p.page_id from Page p join PageUser pu on pu.page_id = p.page_id and pu.user_id = ? and p.unique_pagename = ?;',
                    [req.user_id, req.body.pagename],
                    function(err, results) {
                        if (err){
                            res.status(500).send('An error occurred')
                            console.log(err)
                        }else if(results.length > 0){
                            const missionTitle = req.body.missionTitle.replace(' ', '_')
                            conn.query(
                                'INSERT INTO Mission values (?,?,?,?,now());',
                                [null, results[0].page_id, missionTitle, req.body.missionBody, null],
                                function(err, results) {
                                    if (err) throw err
                                    res.status(200).send()
                                }
                            );
                        }else{
                            res.status(403).send('Permission denied')
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

router.post("/paper_image/process", check.AuthRequired, check.paperAuth, cloudStorage.paper_image, async (req, res) => {
    if(req.user_id){
        let resObject = {url: req.imageUrl}

        if(req.paper_uid){
            resObject.paper_uid = req.paper_uid
        }

        res.json(resObject)
    }else{
        res.status(401).send('Not authenticated')
    }
});

router.post("/fundPageToken", check.AuthRequired, check.fundTransaction, async (req, res) => {
    const connection = new Connection('http://localhost:8899', 'confirmed')
    console.log(req.mint,' unique_pagename ', req.body.unique_pagename)
    try{
        await sendAndConfirmRawTransaction(connection, req.body.tx.data)
        pool.query(
            'UPDATE Page p set p.token_mint_address = ? where p.unique_pagename = ? and p.token_mint_address IS NULL;',
            [req.mint, req.body.unique_pagename],
            function(err, results) {
                if (err){
                    res.status(500).send('An error occurred')
                    console.log(err)
                    return
                }else{
                    console.log(results)
                    res.status(200).send()
                    console.log('Okk2')
                }
            }
        );
    }catch(err){
        res.status(422).send('Transaction Error')
        return
    }
});

module.exports = router;