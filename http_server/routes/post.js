const router = require("express").Router();
const check = require('../middleware/check')
const web3 = require('../utils/web3')
const input_validation = require('../middleware/input_validation')
let pool = require('../config/db');
const cloudStorage = require('../middleware/cloudStorage');
const { sendAndConfirmRawTransaction, Connection } = require("@solana/web3.js");
const gets = require("../utils/gets");
const inserts = require("../utils/inserts");
const deletes = require("../utils/deletes")
const updates = require("../utils/updates");
var validator = require('validator');
const colorOptions = [
    '7dbef5', '097bdc', '2dc3bc', '70908e', '67c166', '189c3b', 'c3c52e', 'd28e2a', 'dcb882', 'af9877', 'd64675', 'bb82c5', 'ac34c1', '9778bf', 'bf1402'
]
const { random_string } = require("../utils/random");
const sharp = require('sharp')
const { uploadFile, deleteFile } = require("../config/storage");

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

router.post("/component", check.AuthRequired, async (req, res) => {

    if(!req.body.pagename){
        return res.status(422).send('Pagename missing')
    }else if(
        !req.body.header ||
        (req.body.header > 100) ||
        (req.body.header < 3)
    ){
        return res.status(422).send('Invalid component Header')
    }else if(
        !req.body.body ||
        (req.body.body > 500) ||
        (req.body.body < 3)
    ){
        return res.status(422).send('Invalid component Body')
    }else if(!req.body.image) {
        return res.status(422).send('Missing component Image')
    }

    const image = req.body.image.split(',')
    if((image.length != 2) || !validator.isBase64(image[1]) || 
    (
        (image[0] != 'data:image/png;base64') &&
        (image[0] != 'data:image/jpeg;base64') &&
        (image[0] != 'data:image/webp;base64')
    )){
        return res.status(422).send('Invalid Data Type')
    }else if(!req.body.mission){
        return res.status(422).send('Mission missing')
    }

    pool.getConnection(async function(err, conn) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            conn.query(
                `SELECT m.mission_id from Mission m 
                join Page p on p.page_id = m.page_id and p.unique_pagename = ? and m.title = ?
                join PageUser pu on pu.user_id = ? and pu.page_id = p.page_id;`,
                [req.body.pagename, req.body.mission, req.user_id],
                async function(err, mission_id) {
                    if (err) throw err
                    if(!mission_id || (mission_id.length == 0)) {
                        pool.releaseConnection(conn);
                        return res.status(400).send('Could not find the mission belonging to your account')
                    }
                    else{
                        let ratio = [512]
            
                        let data = {
                            bucketname: 'comp_images',
                            timefolder: (new Date()).getTime().toString(),
                            randomfolder: await random_string(8)
                        }

                        for(var i=0; i<ratio.length;i++){
                            await sharp(Buffer.from(image[1], 'base64'))
                            .resize({ fit: sharp.fit.contain, width: ratio[i], height: ratio[i] })
                            .webp({ quality: 80 })
                            .toBuffer()
                            .then(async response => {
                                data.buffer = response,
                                data.filename = ratio[i].toString()+'x'+ratio[i].toString()+'.webp'

                                try{
                                    const image_url = await uploadFile(data)
                                    conn.query(
                                        'INSERT INTO Component values (?,?,?,?,?,?,?,now());',
                                        [null, data.timefolder+data.randomfolder, req.body.header, req.body.body, mission_id[0].mission_id, req.body.type, 0, null],
                                        async function(err, compIntert) {
                                            if (err) throw err
                                            if(req.body.uid && data.timefolder+data.randomfolder){
                                                try{
                                                    const component_id = await gets.getComponentIdFromUidUserPostPermission({conn, uid: req.body.uid, user_id: req.user_id})
                                                    const child_component_id = await gets.getComponentIdFromUidUserPostPermission({conn, uid: data.timefolder+data.randomfolder, user_id: req.user_id})
                                                    conn.query(
                                                        `SELECT count(cc.component_connection_id) as nextIndex from
                                                        ComponentConnection cc where cc.component_id = ?;`,
                                                        [component_id],
                                                        async function(err, results) {
                                                            if (err){
                                                                res.status(500).send('An error occurred')
                                                                console.log(err)
                                                            }else{
                                                                await inserts.component_connection({
                                                                    conn,
                                                                    component_id:component_id,
                                                                    child_component_id: child_component_id,
                                                                    child_component_index: results&&(results.length == 1)&&results[0].nextIndex?results[0].nextIndex:0
                                                                })
                                                                return res.status(200).send()
                                                            }
                                                        }
                                                    )
                                                    
                                                }catch(error){
                                                    console.log(error)
                                                    deletes.ComponentAuthRequired({conn, component_id: compIntert.insertId, timefolder: data.timefolder, randomfolder: data.randomfolder})
                                                    .catch((err) => {
                                                        console.log(err)
                                                    })
                                                    .then(() => {
                                                        res.status(500).send('An error occurred while connecting Components')
                                                    })
                                                }
                                            }else{
                                                res.json(data.timefolder+data.randomfolder)
                                            }
                                        }
                                    );
                                }catch(error){
                                    console.log(error)
                                    res.status(500).send('An error occured while uploading file')
                                }

                            }).catch(err =>{
                                console.log("err: ",err);   
                                res.status(500).send() 
                            })
                        }
                    }
                }
            );
        }
        pool.releaseConnection(conn);
    })
})

router.post("/component/connection", check.AuthRequired, async (req, res) => {
    pool.getConnection(async function(err, conn) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            try{
                const component_id = await gets.getComponentIdFromUidUserPostPermission({conn, uid: req.body.parent_component, user_id: req.user_id})

                conn.query(
                    `SELECT count(cc.component_connection_id) as nextIndex from
                    ComponentConnection cc where cc.component_id = ?;`,
                    [component_id],
                    async function(err, results) {
                        if (err){
                            res.status(500).send('An error occurred')
                            console.log(err)
                        }else{
                            for(var i=0;i<req.body.selected.length;i++){
                                const child_component_id = await gets.getComponentIdFromUidUserPostPermission({conn, uid: req.body.selected[i], allowAllUsers: true})
                                if(child_component_id == component_id) throw new Error('Can not add main as sub')
                                await inserts.component_connection({
                                    conn,
                                    component_id:component_id,
                                    child_component_id:child_component_id,
                                    child_component_index: (results&&(results.length == 1)&&results[0].nextIndex?results[0].nextIndex:0)+i
                                })
                            }
                            res.status(200).send()
                        }
                    }
                )
            }catch(err){
                console.log(err)
                res.status(err.status).send(err.message)
            }
        }
    })
})

router.post("/component/save", check.AuthRequired, async (req, res) => {
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
                                'INSERT INTO UserComponentSave values (?,?,?,now());',
                                [null, req.user_id, results[0].component_id, null],
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
                    res.status(200).send()
                }
            }
        );
    }catch(err){
        return res.status(422).send('Transaction Error')
    }
});

// router.post("/forum/reply/:fp_uid", check.AuthRequired, input_validation.missionBody_topicBody_forumPost, input_validation.hex_color, async (req, res) => {
//     pool.getConnection(function(err, conn) {
//         if (err){
//             res.status(500).send('An error occurred')
//             console.log(err)
//         }else{
//             conn.query(
//                 'SELECT fp.left, fp.right, fp.forumpost_parent_id from ForumPost fp where fp.fp_uid = ?;',
//                 [req.params.fp_uid],
//                 function(err, results) {
//                     if (err){
//                         res.status(500).send('An error occurred')
//                         console.log(err)
//                     }else{
//                         if(results.length != 1) return
//                     }
//                 }
//             );
//         }
//         pool.releaseConnection(conn);
//     })
// });


// router.post("/forum/post/:page/:mission/:component", check.AuthRequired, input_validation.missionBody_topicBody_forumPost, input_validation.hex_color, (req, res) => {
//     if(!req.params.component && !req.params.mission && !req.params.page) return res.status(404).send('Not found')
    
//     pool.getConnection(async function(err, conn) {
//         if (err){
//             res.status(500).send('An error occurred')
//             console.log(err)
//         }else{
//             if(req.params.component && req.params.component != '_'){
//                 conn.query('SELECT component_id from Component where uid = ?',
//                     [req.params.component],
//                     async function(err, results){
//                         if(results.length != 1) res.status(404).send('Component not found')
//                         else{
//                             const forumpost_parent_id = await inserts.forumpost_parent(conn, results[0].component_id, 'c')
//                             const forumpost_id = await inserts.forumpost(
//                                     {
//                                         conn: conn,
//                                         forumpost_parent_id: forumpost_parent_id, 
//                                         left: 0, 
//                                         right: 1, 
//                                         depth: 0, 
//                                         message: req.body.forum_post, 
//                                         user_id: req.user_id, 
//                                         hex_color: req.body.hex_color
//                                     }
//                                 )
//                             res.json({
//                                 forumpost_id: forumpost_id
//                             })
//                         }
//                     }
//                 )
//             }else if(req.params.mission && req.params.page && req.params.mission != '_' && req.params.page != '_'){
//                 conn.query('SELECT m.mission_id from Mission m join Page p on m.page_id = m.page_id where m.title = ? and p.unique_pagename = ?',
//                     [req.params.mission, req.params.page],
//                     async function(err, results){
//                         if(results.length != 1) res.status(404).send('Mission not found')
//                         else{
//                             const forumpost_parent_id = await inserts.forumpost_parent(conn, results[0].mission_id, 'm')
//                             const forumpost_id = await inserts.forumpost(
//                                     {
//                                         conn: conn,
//                                         forumpost_parent_id: forumpost_parent_id, 
//                                         left: 0, 
//                                         right: 1, 
//                                         depth: 0, 
//                                         message: req.body.forum_post, 
//                                         user_id: req.user_id, 
//                                         hex_color: req.body.hex_color
//                                     }
//                                 )
//                             res.json({
//                                 forumpost_id: forumpost_id
//                             })
//                         }
//                     }
//                 )
//             }else if(req.params.page && req.params.page != '_'){
//                 conn.query('SELECT p.page_id from Page p where p.unique_pagename = ?',
//                     [req.params.page],
//                     async function(err, results){
//                         if(results.length != 1) res.status(404).send('Mission not found')
//                         else{
//                             const forumpost_parent_id = await inserts.forumpost_parent(conn, results[0].page_id, 'p')
//                             const forumpost_id = await inserts.forumpost(
//                                     {
//                                         conn: conn,
//                                         forumpost_parent_id: forumpost_parent_id, 
//                                         left: 0, 
//                                         right: 1, 
//                                         depth: 0, 
//                                         message: req.body.forum_post, 
//                                         user_id: req.user_id, 
//                                         hex_color: req.body.hex_color
//                                     }
//                                 )
//                             res.json({
//                                 forumpost_id: forumpost_id
//                             })
//                         }
                        
//                     }
//                 )
//             }
//         }
//         pool.releaseConnection(conn);
//     })
// });

/*
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
*/

module.exports = router;