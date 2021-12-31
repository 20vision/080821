const router = require("express").Router();
const input_validation = require('../middleware/input_validation');
const check = require('../middleware/check')
let pool = require('../config/db');
let gets = require('../utils/gets');



// PRIVATE //////////////////////////////////////////////////

router.post("/username_unique", input_validation.checkRegexUsername, input_validation.checkUniqueUsername, async (req, res) => {
    res.status(200).send()
});

router.post("/pagename_unique", input_validation.checkRegexPagename, input_validation.checkUniquePagename, async (req, res) => {
    res.status(200).send()
});

router.get("/mission_title_unique/:pagename/:mission_title", input_validation.checkUniqueMissionTitle, async (req, res) => {
    res.status(200).send()
});

router.get("/my_pages/:page", check.AuthRequired, async (req, res) => {
    if(req.user_id){
        pool.query(
            'SELECT p.page_icon, p.pagename, p.unique_pagename, p.vision FROM PageUser pu join Page p on pu.page_id = p.page_id where pu.user_id = ? order by pu.last_selected desc limit ?, 6;',
            [req.user_id, (parseInt(req.params.page)*6)],
            function(err, results) {
                if (err){
                    res.status(500).send('An error occurred')
                    console.log(err)
                }else{
                    let isLimit
                    if((results) && (results.length == 6)){
                        isLimit = (parseInt(req.params.page) + 1)
                    }else{
                        isLimit = null
                    }
                    res.json({
                        my_pages: results,
                        nextId: isLimit
                    })
                }
            }
        );
    }else{
        res.status(401).send()
    }
});

router.get("/user_profile", check.AuthOptional, async (req, res) => {
    if(req.user_id){
        pool.query(
            'SELECT u.username, u.profilePicture FROM User u where u.user_id = ?;',
            [req.user_id],
            function(err, results) {
                if (err){
                    res.status(500).send('An error occurred')
                    console.log(err)
                }else{
                    res.json({
                        username: results[0].username,
                        profilePicture: results[0].profilePicture
                    })
                }
            }
        );
    }else{
        res.json({
            username: null,
            profilePicture: null
        })
    }
    
})


// PUBLIC //////////////////////////////////////////////////

router.get("/page/:page_name", check.AuthOptional, check.role, async (req, res) => {
    pool.getConnection(async function(err, conn) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            try{
                const pageByName = await gets.getPageByName(conn, req.params.page_name)
                const missions = await gets.getMission_s(conn, req.params.page_name)
                res.json({
                    page: pageByName.page,
                    missions: missions
                })
            }catch(err){
                console.log(err)
                res.status(err.status).send(err.message)
            }
        }
        pool.releaseConnection(conn);
    })
})

router.get("/page/:page_name/trade_info", check.AuthOptional, check.role, async (req, res) => {
    pool.getConnection(async function(err, conn) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            conn.query(
                'SELECT u.public_key, p.token_mint_address from User u join PageUser pu on pu.user_id = u.user_id and pu.role = 1 join Page p on p.unique_pagename = ? and p.page_id = pu.page_id;',
                [req.params.page_name],
                function(err, result) {
                    if (err){
                        res.status(500).send('An error occurred')
                        console.log(err)
                    }else{
                        if(result && result[0] && result[0].public_key){
                            res.json({
                                public_key: result[0].public_key,
                                token_mint_address: result[0].token_mint_address,
                            })
                        }else{
                            res.status(404).send('Not found')
                        }
                    }
                }
            );
        }
        pool.releaseConnection(conn);
    })
})


// FORUM


router.get("/forum", async (req, res) => {
    console.log('route not ready yet')
    res.status(404).send('not ready yet')
})
router.get("/forum/:unique_pagename", async (req, res) => {
    
})
// Only Page related
router.get("/forum/:unique_pagename/p", check.AuthOptional, async (req, res) => {
    pool.getConnection(async function(err, conn) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            try{
                const pageByName = await gets.getPageByName(conn, req.params.unique_pagename)
                conn.query(
                    `SELECT IF(fpl.forum_post_like_id, true, false) as 'like', fp.forumpost_id, fp.hex_color, fp.message, fp.created, u.username, u.profilePicture FROM ForumPost fp
                    join User u on u.user_id = fp.user_id 
                    join ForumPost_Parent fpp on fp.forumpost_parent_id = fpp.forumpost_parent_id and fpp.parent_type = 'p' and fpp.parent_id = ?
                    left join ForumPost_Like fpl on fpl.forumpost_id = fp.forumpost_id and fpl.user_id = ?
                    group by fp.forumpost_id;`,
                    [pageByName.page_id, req.user_id],
                    function(err, content) {
                        if (err){
                            res.status(500).send('An error occurred')
                            console.log(err)
                        }else{
                            console.log(content)
                            res.json({
                                page: pageByName.page,
                                content: content
                            })
                        }
                    }
                );
            }catch(err){
                console.log(err)
                res.status(err.status).send(err.message)
            }
        }
        pool.releaseConnection(conn);
    })
})
// Only Mission related
router.get("/forum/:unique_pagename/m/:mission_title", async (req, res) => {
    pool.getConnection(async function(err, conn) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            try{
                const pageByName = await gets.getPageByName(conn, req.params.unique_pagename)
                const mission_s = await gets.getMission_s(conn, req.params.unique_pagename, req.params.mission_title)
                conn.query(
                    `SELECT fp.forumpost_id, fp.message, u.username, u.profilePicture FROM ForumPost fp 
                    join User u on u.user_id = fp.user_id 
                    join ForumPost_Parent fpp on fp.forumpost_parent_id = fpp.forumpost_parent_id and fpp.parent_type = 'm' and fpp.parent_id = ?;`,
                    [mission_s.mission_id],
                    function(err, content) {
                        if (err){
                            res.status(500).send('An error occurred')
                            console.log(err)
                        }else{
                            res.json({
                                page: pageByName.page,
                                mission: mission_s.mission,
                                content: content
                            })
                        }
                    }
                );
            }catch(err){
                console.log(err)
                res.status(err.status).send(err.message)
            }
        }
        pool.releaseConnection(conn);
    })
})
// Only Topic related
router.get("/post/forum/:post_id", async (req, res) => {
    console.log('route not ready yet')
    res.status(404).send('not ready yet')
})
// Only Topic related
router.get("/forum/:unique_pagename/t/:topic_name", async (req, res) => {
    console.log('route not ready yet')
    res.status(404).send('not ready yet')
})
// Only Paper related
router.get("/forum/:unique_pagename/pa/:uid", async (req, res) => {
    console.log('route not ready yet')
    res.status(404).send('not ready yet')
})

// router.get("/forum/post/:offset", async (req, res) => {
//     console.log(req.params.forumpost_parent_OR_post_id)
//     pool.getConnection(async function(err, conn) {
//         if (err){
//             res.status(500).send('An error occurred')
//             console.log(err)
//         }else{
//             try{
//                 const root = await getForumRootElements(conn,req)
//                 const content = await getContent(conn, root.parentId)
//             }catch(err){

//             }
//         }
//         pool.releaseConnection(conn);
//     })
// })

module.exports = router;