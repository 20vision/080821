const router = require("express").Router();
const check = require('../middleware/check')
const web3 = require('../utils/web3')
const input_validation = require('../middleware/input_validation')
let pool = require('../config/db');
const cloudStorage = require('../middleware/cloudStorage');
const { sendAndConfirmRawTransaction, Connection } = require("@solana/web3.js");
const { getForumInfo } = require("../utils/info");

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

router.post("/mission", check.AuthRequired, check.role, input_validation.checkUniqueMissionTitle, input_validation.missionBody_and_forumPost, async (req, res) => {
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
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
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

router.post("/forum", check.AuthRequired, input_validation.missionBody_and_forumPost, async (req, res) => {
    // // Main_Forum_Post_Adjacency_List -> parent_type -> 0=page, 1=mission, 2=topics, 3=paper
    // console.log(req)
    // pool.getConnection(async function(err, conn) {
    //     if (err){
    //         res.status(500).send('An error occurred')
    //         console.log(err)
    //     }else{
    //         try{
    //             const info = await getForumInfo(conn, req)
    //             const impact = await web3.getTokenImpact(conn, req)
    //             console.log(req.body.subject)
    //             if(req.body.subject == null){
    //                 // Handle Sub_Forum_Post
    //             }else{
    //                 conn.query(
    //                     'INSERT INTO Main_Forum_Post_Adjacency_List values (?,?,?,?,?,?,?,now());',
    //                     [null, info.id, req.body.subject, req.body.forum_post, req.user_id, req.body.hexColor, impact],
    //                     async function(err, forum_result) {
    //                         if (err){
    //                             res.status(500).send('An error occurred')
    //                             console.log(err)
    //                         }else{
    //                             res.status(200).send()
    //                         }
    //                     }
    //                 );
    //             }
    //         }catch(err){
    //             console.log(err)
    //             res.status(err.status).send(err.message)
    //         }
    //     }
    //     pool.releaseConnection(conn);
    // })
});

module.exports = router;