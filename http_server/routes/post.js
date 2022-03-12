const router = require("express").Router();
const check = require('../middleware/check')
const web3 = require('../utils/web3')
const input_validation = require('../middleware/input_validation')
let pool = require('../config/db');
const cloudStorage = require('../middleware/cloudStorage');
const { sendAndConfirmRawTransaction, Connection } = require("@solana/web3.js");
const gets = require("../utils/gets");
const inserts = require("../utils/inserts");
const updates = require("../utils/updates");
var validator = require('validator');
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

router.post("/mission", check.AuthRequired, check.role, input_validation.checkUniqueMissionTitle, input_validation.missionBody_topicBody_forumPost, async (req, res) => {
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
                            const missionTitle = req.body.missionTitle.replace(/ /g, '_');
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

router.post("/paper", async (req, res) => {

    if(!validator.isBase64(req.body.image) || (!validator.isMimeType('image/png') && !validator.isMimeType('image/jpeg'))){
        return res.status(422).send('Invalid Data Type')
    }

    let imageBuffer = Buffer.from(req.body.image, 'base64')



    await sharp(req.file.buffer)
    .resize({ fit: sharp.fit.contain, width: ratio[i], height: ratio[i] })
    .webp({ quality: 60 })
    .toBuffer()
    .then(async response => {
        data.buffer = response,
        data.filename = ratio[i].toString()+'x'+ratio[i].toString()+'.webp'
        try{
            req.imageUrl = await uploadFile(data)
        }catch(error){
            console.log(error)
            res.status(500).send('An error occured while uploading file')
        }
    }).catch(err =>{
        console.log("err: ",err);   
        res.status(500).send() 
    })
})

router.post("/topic", check.AuthRequired, check.role, input_validation.checkUniqueTopicTitle, input_validation.missionBody_topicBody_forumPost, async (req, res) => {
    if(req.user_id){
        if((req.body.topicThreshold != null) && (isNaN(req.body.topicThreshold) || (req.body.topicThreshold.length > 25))){
            res.status(422).send('Invalid Token Entry')
        }else{
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
                                const topicTitle = req.body.topicTitle.replace(/ /g, '_')
                                conn.query(
                                    'INSERT INTO Topic values (?,?,?,?,?,now());',
                                    [null, results[0].page_id, topicTitle, req.body.topicBody, req.body.topicThreshold?req.body.topicThreshold:'0', null],
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
        }
    }else{
        res.status(401).send('Not authenticated')
    }
});

/*router.post("/paper_image/process", check.AuthRequired, check.paperAuth, cloudStorage.paper_image, async (req, res) => {
    if(req.user_id){
        let resObject = {url: req.imageUrl}

        if(req.paper_uid){
            resObject.paper_uid = req.paper_uid
        }

        res.json(resObject)
    }else{
        res.status(401).send('Not authenticated')
    }
});*/

router.post("/fundPageToken", check.AuthRequired, check.fundTransaction, async (req, res) => {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
    try{
        await sendAndConfirmRawTransaction(connection, req.body.tx.data)
        pool.query(
            'UPDATE Page p set p.token_mint_address = ? where p.unique_pagename = ? and p.token_mint_address IS NULL;',
            [req.mint, req.body.unique_pagename],
            function(err, results) {
                if (err){
                    console.log(err)
                    return res.status(500).send('An error occurred')
                }else{
                    console.log(results)
                    res.status(200).send()
                }
            }
        );
    }catch(err){
        return res.status(422).send('Transaction Error')
    }
});

router.post("/forum/:unique_pagename/topic/:topic_id", check.AuthRequired, input_validation.missionBody_topicBody_forumPost, input_validation.hex_color, async (req, res) => {
    pool.getConnection(async function(err, conn) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            conn.query(
                `SELECT t.threshold, p.token_mint_address from Topic t 
                join Page p on t.page_id = p.page_id and p.unique_pagename = ? and t.topic_id = ?`,
                [req.params.unique_pagename, parseInt(req.params.topic_id)],
                async function(err, topic) {
                    if (err){
                        reject({
                            status: 500,
                            message: 'An error occurred'
                        })
                        console.log(err)
                    }else{
                        if(topic.length > 0){
                            try{
                                const tokenAmountAndImpact = await web3.getTokenAmountAndImpact(conn, topic[0].token_mint_address, req.user_id)

                                if(tokenAmountAndImpact.balance < web3.getBigNumber(topic[0].threshold)){
                                    res.status(422).send(`Your ${req.params.unique_pagename} token balance is below the topic threshold`)
                                }else{
                                    const forumpost_parent_id = await inserts.forumpost_parent(conn, parseInt(req.params.topic_id), 't')
                                    const forumpost_id = await inserts.forumpost(conn, forumpost_parent_id, 0, 1, 0, req.body.forum_post, req.user_id, req.body.hex_color, tokenAmountAndImpact.impact)
                                    res.json({
                                        forumpost_id: forumpost_id
                                    })
                                }
                            }catch(err){
                                console.log(err)
                                res.status(err.status).send(err.message)
                            }
                        }else{
                            res.status(404).send('topic not found')
                        }
                    }
                }
            );
        }
        pool.releaseConnection(conn);
    })
})

router.post("/forum/:unique_pagename/page", check.AuthRequired, input_validation.missionBody_topicBody_forumPost, input_validation.hex_color, async (req, res) => {
    pool.getConnection(async function(err, conn) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            try{
                const pageByName = await gets.getPageByName(conn, req.params.unique_pagename)
                const forumpost_parent_id = await inserts.forumpost_parent(conn, pageByName.page_id, 'p')
                const user_token_impact_per_mission = await web3.getTokenAmountAndImpact(conn, pageByName.token_mint_address, req.user_id)
                const forumpost_id = await inserts.forumpost(conn, forumpost_parent_id, 0, 1, 0, req.body.forum_post, req.user_id, req.body.hex_color, user_token_impact_per_mission.impact)
                res.json({
                    forumpost_id: forumpost_id
                })
            }catch(err){
                console.log(err)
                res.status(err.status).send(err.message)
            }
        }
        pool.releaseConnection(conn);
    })
})

router.post("/forum/:unique_pagename/post/:parent_forumpost_id", check.AuthRequired, input_validation.missionBody_topicBody_forumPost, input_validation.hex_color, async (req, res) => {
    pool.getConnection(async function(err, conn) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            try{
                const forumpost_parent_info = await gets.getForumPostParentInfo(conn, req.params.parent_forumpost_id)
                const user_token_impact_per_mission = await web3.getTokenAmountAndImpact(conn, forumpost_parent_info.token_mint_address, req.user_id)
                await updates.updateNestedForumSet(conn, forumpost_parent_info.forumpost_parent_id, forumpost_parent_info.right, forumpost_parent_info.right + 1)
                const forumpost_id = await inserts.forumpost(conn, forumpost_parent_info.forumpost_parent_id, forumpost_parent_info.right, forumpost_parent_info.right+1, forumpost_parent_info.depth + 1, req.body.forum_post, req.user_id, req.body.hex_color, user_token_impact_per_mission.impact)
                console.log(forumpost_id)
                res.json({
                    forumpost_id: forumpost_id
                })
            }catch(err){
                console.log(err)
                res.status(err.status).send(err.message)
            }
        }
        pool.releaseConnection(conn);
    })
})


module.exports = router;