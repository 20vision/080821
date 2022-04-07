const router = require("express").Router();
const input_validation = require('../middleware/input_validation');
const check = require('../middleware/check')
let pool = require('../config/db');
let gets = require('../utils/gets');
const res = require("express/lib/response");
const req = require("express/lib/request");



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

router.get("/topic_title_unique/:pagename/:topic_title", input_validation.checkUniqueTopicTitle, async (req, res) => {
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
            'SELECT u.username, u.profilePicture, u.public_key FROM User u where u.user_id = ?;',
            [req.user_id],
            function(err, results) {
                if (err){
                    res.status(500).send('An error occurred')
                    console.log(err)
                }else{
                    res.json({
                        username: results[0].username,
                        profilePicture: results[0].profilePicture,
                        public_key: results[0].public_key
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

router.get("/page/:page_name/components/:offset/:mission_title", check.AuthOptional, async (req, res) => {
    pool.getConnection(async function(err, conn) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            try{
                conn.query(
                    `SELECT
                    c.uid,
                    c.header,
                    c.body,
                    p.unique_pagename,
                    c.type,
                    m.title as mission_title,
                    c.created,
                    count(cc1.component_connection_id) as subcomponents
                    from Component c
                    join Mission m on m.mission_id = c.mission_id join Page p on m.page_id = p.page_id and p.unique_pagename = ? and m.title = ?
                    left join ComponentConnection cc1 on cc1.component_id = c.component_id
                    group by c.component_id 
                    order by subcomponents desc, c.created desc
                    limit ?,3`,
                    [req.params.page_name, req.params.mission_title, parseInt(req.params.offset)],
                    function(err, components) {
                        if (err){
                            res.status(500).send('An error occurred')
                            console.log(err)
                        }else{
                            res.json(components)
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

router.get("/page/:page_name/components/:offset", check.AuthOptional, async (req, res) => {
    pool.getConnection(async function(err, conn) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            try{
                conn.query(
                    `SELECT
                    c.uid,
                    c.header,
                    c.body,
                    p.unique_pagename,
                    c.type,
                    m.title as mission_title,
                    c.created,
                    count(cc1.component_connection_id) as subcomponents
                    from Component c
                    join Mission m on m.mission_id = c.mission_id join Page p on m.page_id = p.page_id and p.unique_pagename = ?
                    left join ComponentConnection cc1 on cc1.component_id = c.component_id
                    group by c.component_id 
                    order by subcomponents desc, c.created desc
                    limit ?,3`,
                    [req.params.page_name, parseInt(req.params.offset)],
                    function(err, components) {
                        if (err){
                            res.status(500).send('An error occurred')
                            console.log(err)
                        }else{
                            res.json(components)
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

router.get("/page/:unique_pagename/component/count", async (req, res) => {
    pool.query('SELECT count(c.component_id) as components_count from Page p join Mission m on m.page_id = p.page_id join Component c on c.mission_id = m.mission_id where p.unique_pagename = ?',[req.params.unique_pagename], function(err, result) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            res.json(result[0] && result[0].components_count?result[0].components_count:0)
        }
    })
})

router.get("/page/components/:offset", check.AuthOptional, async (req, res) => {
    pool.getConnection(async function(err, conn) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            try{
                conn.query(
                    `SELECT
                    c.uid,
                    c.header,
                    c.body,
                    c.type,
                    m.title as mission_title,
                    p.unique_pagename,
                    p.pagename,
                    p.vision,
                    p.page_icon,
                    c.created,
                    count(cc1.component_connection_id) as subcomponents
                    from Component c
                    join Mission m on m.mission_id = c.mission_id join Page p on m.page_id = p.page_id
                    left join ComponentConnection cc1 on cc1.component_id = c.component_id
                    group by c.component_id 
                    order by subcomponents desc, c.created desc
                    limit ?,3`,
                    [parseInt(req.params.offset)],
                    function(err, components) {
                        if (err){
                            res.status(500).send('An error occurred')
                            console.log(err)
                        }else{
                            res.json(components)
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

router.get("/page/:page_name", check.AuthOptional, async (req, res) => {
    pool.getConnection(async function(err, conn) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            try{
                const pageByName = await gets.getPageByName(conn, req.params.page_name)
                if(req.query.missions === 'false') return res.json({page: pageByName})
                const missions = await gets.getMission_s(conn, req.params.page_name)
                res.json({
                    page: pageByName,
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

router.get("/page/:page_name/trade_info", check.AuthOptional, async (req, res) => {
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
                                fee_collector: result[0].public_key,
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


// Forum

// Discover
router.get("/forum/discover/:offset", async (req, res) => {
    let poolp = pool.promise()
    let response = []
    let targetConditions = {}

    try{
        
        if(req.query.page){
            let queryPage = (await poolp.query(`SELECT
            p.page_id,
            p.page_icon,
            p.pagename,
            p.unique_pagename,
            p.vision
            from Page p where p.unique_pagename = ?`,[req.query.page]))[0]
            if(!queryPage || queryPage.length != 1) return res.status(404).send('Page not found')
            targetConditions.mission_id = queryPage[0].page_id
            delete queryPage[0].page_id
            response = [{page: queryPage[0]}]
        }

        if(req.query.mission && req.query.page){
            let queryMission = (await poolp.query(`SELECT 
            m.mission_id,
            m.title, 
            m.description,
            p.unique_pagename
            from Mission m 
            join Page p on p.page_id = m.page_id and m.title = ? and p.unique_pagename = ?`,
            [req.query.mission, req.query.page]))[0]
            if(!queryMission || queryMission.length != 1) return res.status(404).send('Mission not found')
            targetConditions.mission_id = queryMission[0].mission_id
            delete queryMission[0].mission_id
            response[0].sub = [{mission: queryMission[0]}]
        }

        if(req.query.component){
            let queryComponent = (await poolp.query('SELECT c.component_id, c.uid, c.header, c.body, c.type, c.created from Component c where c.uid = ?',[req.query.component]))[0]
            if(!queryComponent || queryComponent.length != 1) return res.status(404).send('Component not found')
            targetConditions.component_id = queryComponent[0].component_id
            delete queryComponent[0].component_id
            if(req.query.page && req.query.mission){
                response[0].sub[0].sub = [{component: queryComponent[0]}]
            }else if(req.query.page){
                response[0].sub = [{component: queryComponent[0]}]
            }else{
                response = [{component: queryComponent[0]}]
            }
        }
        
        response[0].page.target_uid = (await poolp.query(`SELECT fp.fp_uid, count(fpl.forum_post_like_id) as tree_likes from ForumPost fp
        join ForumPost fp2 on fp2.left <= fp.left and fp2.right >= fp.right
        join ForumPost_Parent fpp on fpp.forumpost_parent_id = fp.forumpost_parent_id
        left join ForumPost_Like fpl on fpl.forumpost_id = fp2.forumpost_id
        where fp.left + 1 = fp.right 
        ${targetConditions.component_id?`and fpp.parent_id = ? and fpp.parent_type = 'c'`:
        targetConditions.mission_id?`and fpp.parent_id = ? and fpp.parent_type = 'm'`:
        targetConditions.page_id?`and fpp.parent_id = ? and fpp.parent_type = 'p'`:
        null}
        group by fp.forumpost_parent_id, fp.forumpost_id
        order by tree_likes desc
        limit 0,1`,[...[
            targetConditions.component_id?
                targetConditions.component_id:
            targetConditions.mission_id?
                targetConditions.mission_id:
            targetConditions.page_id?
                targetConditions.page_id
            :null],...[req.params.offset?parseInt(req.params.offset):0]]))[0].fp_uid
        
        res.json(response)
    }catch(err){
        console.log(err)
        res.status(400).send('An error occurred')
    }
})

router.get("/forum/:target_uid/:offset", () => {
    pool.getConnection(function(err, conn) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            try{
                conn.query(
                    `SELECT left, right, depth, forumpost_parent_id from ForumPost where fp_uid = ?`,
                    [req.params.target_uid], async function(err, target) {
                        if (err){
                            console.log(err)
                            res.status(400).send('An error occurred')
                        }else{
                            if(target.length != 1) return res.status(404).send('Target Forum Post not found')
                            conn.query(
                                `
                                SELECT
                                    fp2.depth
                                    ,fp2.left
                                    ,fp2.right
                                    ,fp2.forumpost_id
                                    ,fpp.parent_id
                                    ,fpp.parent_type
                                    ,fp2.forumpost_parent_id
                                    ,fp2.hex_color
                                    ,fp2.message
                                    ,fp2.created
                                    ,u.username
                                    ,u.profilePicture
                                from ForumPost fp2
                                join ForumPost_Parent fpp
                                where fp2.left < ? and fp2.right > ? and fp2.forumpost_parent_id = ?
                                order by fp2.depth desc
                                limit ?,3 
                                `,
                                [target[0].left,target[0].right,target[0].forumpost_parent_id,req.params.offset?req.params.offset:0], async function(err, verticallyFetched) {
                                    if (err){
                                        console.log(err)
                                        res.status(400).send('An error occurred')
                                    }else{
                                        res.json(verticallyFetched)
                                    }
                                }
                            );
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

// Only Page related
// router.get("/forum/:unique_pagename/page", check.AuthOptional, async (req, res) => {
//     pool.getConnection(async function(err, conn) {
//         if (err){
//             res.status(500).send('An error occurred')
//             console.log(err)
//         }else{
//             try{
//                 const pageByName = await gets.getPageByName(conn, req.params.unique_pagename)
//                 let tree_count = 0
//                 let content = []
//                 conn.query(`SELECT count(forumpost_parent_id) as tree_count from ForumPost_Parent where parent_id = ? and parent_type = 'p'`,
//                     [pageByName.page_id],
//                     async function(err, query_tree_count) {
//                         if (err){
//                             console.log(err)
//                             res.status(400).send('An error occurred')
//                         }else{
//                             tree_count = query_tree_count[0].tree_count
//                             if(!tree_count) return res.json({content: [[pageByName]],tree_count: 0})
//                             try{
//                                 let new__main_content = await gets.getForumPost({conn: conn, user_id: req.user_id, page_id: pageByName.page_id, 
//                                     depth: 0, 
//                                     left: null,
//                                     right: null})
//                                 if(new__main_content.length == 0){
//                                     return res.json({content: [[pageByName]],tree_count: tree_count?tree_count:0})
//                                 }else{
//                                     content.push(new__main_content)
//                                     for(var i = 0; i <= 5; i++){
//                                         const new_content_array = await gets.getForumPost({
//                                             conn: conn,
//                                             user_id: req.user_id,
//                                             forumpost_parent_id: new__main_content[0].forumpost_parent_id,
//                                             depth: i+1,
//                                             left: content[content.length-1][0].left,
//                                             right: content[content.length-1][0].right
//                                         })
//                                         if(new_content_array.length == 0) break
//                                         new_content_array.forEach(function (new_content){
//                                             if(new_content.right + 1 == content[i][0].right){
//                                                 new_content.next = false
//                                             }else{
//                                                 new_content.next = true
//                                             }
//                                         })
//                                         content.push(new_content_array)
//                                     }
//                                 }
//                             }catch{
//                                 console.log(err)
//                                 res.status(err.status).send(err.message)
//                             }
//                             res.json({
//                                 content: [
//                                     [pageByName],
//                                     ...content
//                                 ],
//                                 tree_count: tree_count?tree_count:0
//                             })
//                         }
//                     }
//                 );
//             }catch(err){
//                 console.log(err)
//                 res.status(err.status).send(err.message)
//             }
//         }
//         pool.releaseConnection(conn);
//     })
// })

// // Responds back one depth reply, but multiple versions depending on offset (3)
// router.get("/forum/:unique_pagename/posts/:forumpost_parent_id", check.AuthOptional, async (req, res) => {
//     // queries -> depth, offset
//     if(((req.query.depth == null) || isNaN(req.query.depth)) ||
//     (req.query.offset && isNaN(req.query.offset)) ||
//     ((parseInt(req.query.depth) == 0 && req.query.parent_id == null) || req.query.parent_id && isNaN(req.query.parent_id))
//     ){
//         return res.status(422).send('Invalid query parameter')
//     }

//     console.log(req.query)

//     pool.getConnection(async function(err, conn) {
//         try{
//             new_content = await gets.getForumPost({
//                 conn: conn,
//                 user_id: req.user_id,
//                 forumpost_parent_id: parseInt(req.params.forumpost_parent_id),
//                 depth: parseInt(req.query.depth),
//                 offset: req.query.offset?parseInt(req.query.offset):null,
//                 parent_id: req.query.parent_id?parseInt(req.query.parent_id):null
//             })
//             res.json(new_content)
//         }catch(err){
//             console.log(err)
//             res.status(err.status).send(err.message)
//         }
//         pool.releaseConnection(conn);
//     })
// })


// // Responds back multi depth replies (5) x (3)
// router.get("/forum/:unique_pagename/replies/:parent_post_id", check.AuthOptional, async (req, res) => {
//     pool.getConnection(async function(err, conn) {
//         let content = []
//         const post_parent_info = await gets.getForumPostParentInfo(conn, req.params.parent_post_id)

//         try{
//             for(var i = 0; i <= 5; i++){
//                 const new_content = await gets.getForumPost({
//                     conn: conn,
//                     user_id: req.user_id,
//                     forumpost_parent_id: post_parent_info.forumpost_parent_id,
//                     depth: post_parent_info.depth+i+1,
//                     left: ((content.length > 0)?content[content.length-1][0].left:post_parent_info.left),
//                     right: ((content.length > 0)?content[content.length-1][0].right:post_parent_info.right)
//                 })
//                 if(new_content.length == 0){
//                     break
//                 }else{
//                     content.push(new_content)
//                 }
//             }
//         }catch(err){
//             console.log(err)
//             res.status(err.status).send(err.message)
//         }

//         res.json(content)
//         pool.releaseConnection(conn);
//     })
// })

// // Only Mission related
// router.get("/forum/:unique_pagename/mission/:mission_title", async (req, res) => {
//     res.status(404).send('Not finished yet')
//     console.log('Route not finished')
//     // pool.getConnection(async function(err, conn) {
//     //     if (err){
//     //         res.status(500).send('An error occurred')
//     //         console.log(err)
//     //     }else{
//     //         try{
//     //             const pageByName = await gets.getPageByName(conn, req.params.unique_pagename)
//     //             const mission_s = await gets.getMission_s(conn, req.params.unique_pagename, req.params.mission_title)
//     //             conn.query(
//     //                 `SELECT fp.forumpost_id, fp.message, u.username, u.profilePicture FROM ForumPost fp 
//     //                 join User u on u.user_id = fp.user_id 
//     //                 join ForumPost_Parent fpp on fp.forumpost_parent_id = fpp.forumpost_parent_id and fpp.parent_type = 'm' and fpp.parent_id = ?;`,
//     //                 [mission_s.mission_id],
//     //                 function(err, content) {
//     //                     if (err){
//     //                         res.status(500).send('An error occurred')
//     //                         console.log(err)
//     //                     }else{
//     //                         res.json({
//     //                             page: pageByName,
//     //                             mission: mission_s.mission,
//     //                             content: content
//     //                         })
//     //                     }
//     //                 }
//     //             );
//     //         }catch(err){
//     //             console.log(err)
//     //             res.status(err.status).send(err.message)
//     //         }
//     //     }
//     //     pool.releaseConnection(conn);
//     // })
// })
// // Only Topic related
// router.get("/forum/:unique_pagename/topics", async (req, res) => {
//     pool.getConnection(async function(err, conn) {
//         if (err){
//             res.status(500).send('An error occurred')
//             console.log(err)
//         }else{
//             try{
//                 const pageByName = await gets.getPageByName(conn, req.params.unique_pagename)
//                 let topics = await gets.getTopic_s({conn: conn, unique_pagename: req.params.unique_pagename});
//                 if(topics.length == 0) return(res.json({content: [[pageByName]],tree_count: tree_count?tree_count:0}))
//                 let tree_count = 0
//                 let content = []
//                 conn.query(`SELECT count(fpp.forumpost_parent_id) as tree_count from ForumPost_Parent fpp 
//                 join Topic t on fpp.parent_type = 't' and fpp.parent_id = t.topic_id and t.page_id = ?`,
//                     [pageByName.page_id],
//                     async function(err, query_tree_count) {
//                         if (err){
//                             console.log(err)
//                             res.status(400).send('An error occurred')
//                         }else{
//                             tree_count = query_tree_count[0].tree_count
//                             console.log(tree_count)
//                             if(!tree_count){
//                                 return res.json({
//                                     content: [[pageByName],topics],
//                                     tree_count: 0
//                                 })
//                             }
//                             try{
//                                 let new__main_content = await gets.getForumPost({
//                                     conn: conn, 
//                                     user_id: req.user_id, 
//                                     topic_id: topics[0].topic_id, 
//                                     depth: 0})
//                                 if(new__main_content.length == 0){
//                                     return res.json({
//                                         content: [[pageByName]],
//                                         tree_count: tree_count?tree_count:0,
//                                     });
//                                 }else{
//                                     content.push(new__main_content)
//                                     for(var i = 0; i <= 5; i++){
//                                         const new_content_array = await gets.getForumPost({
//                                             conn: conn,
//                                             user_id: req.user_id,
//                                             forumpost_parent_id: new__main_content[0].forumpost_parent_id,
//                                             depth: i+1,
//                                             left: content[content.length-1][0].left,
//                                             right: content[content.length-1][0].right
//                                         })
//                                         if(new_content_array.length == 0) break
//                                         new_content_array.forEach(function (new_content){
//                                             if(new_content.right + 1 == content[i][0].right){
//                                                 new_content.next = false
//                                             }else{
//                                                 new_content.next = true
//                                             }
//                                         })
//                                         content.push(new_content_array)
//                                     }
//                                 }
//                             }catch{
//                                 console.log(err)
//                                 res.status(err.status).send(err.message)
//                             }
//                             res.json({
//                                 content: [
//                                     [pageByName],
//                                     topics,
//                                     ...content
//                                 ],
//                                 tree_count: tree_count?tree_count:0,
//                             })
//                         }
//                     }
//                 );
//             }catch(err){
//                 console.log(err)
//                 res.status(err.status).send(err.message)
//             }
//         }
//         pool.releaseConnection(conn);
//     })
// })
// Only component related
// router.get("/forum/:unique_pagename/components/:uid", async (req, res) => {
//     console.log('route not ready yet')
//     res.status(404).send('not ready yet')
// })

router.get("/component/:uid/dependents/count", async (req, res) => {
    pool.query(
        `SELECT count(cc.component_connection_id) as dependentsCount from ComponentConnection cc 
        join Component c on c.component_id = cc.child_component_id
        where c.uid = ?`,
        [req.params.uid],
        function(err, count) {
            if (err){
                res.status(500).send('An error occurred')
                console.log(err)
            }else{
                res.json({
                    count: count[0].dependentsCount
                })
            }
        }
    );
})
router.get("/component/:uid/dependents/:offset", async (req, res) => {
    pool.query(
        `SELECT p.unique_pagename, m.title as mission_title, p.page_icon, c.uid, c.header, c.type, c.created from Component c
        join ComponentConnection cc on c.component_id = cc.component_id
        join Component c1 on c1.component_id = cc.child_component_id
        join Mission m on m.mission_id = c1.mission_id join Page p on p.page_id = m.page_id
        where c1.uid = ?
        group by c.uid
        limit ?,3`,
        [req.params.uid, parseInt(req.params.offset)],
        function(err, dependents) {
            if (err){
                res.status(500).send('An error occurred')
                console.log(err)
            }else{
                console.log(dependents)
                res.json({
                    dependents: dependents
                })
            }
        }
    );
})

router.get("/component/:uid/subs", async (req, res) => {
    pool.getConnection(async function(err, conn) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            conn.query(
                `SELECT cc.child_component_index, c.uid, c.header, c.body, c.type, m.title as mission_title, c.created, count(cc1.component_connection_id) as subcomponents, p.unique_pagename from ComponentConnection cc 
                join Component c on c.component_id = cc.child_component_id
                join Mission m on m.mission_id = c.mission_id join Page p on m.page_id = p.page_id
                join Component c1 on c1.component_id = cc.component_id and c1.uid = ?
                left join ComponentConnection cc1 on cc1.component_id = c.component_id
                group by cc.component_connection_id
                order by cc.child_component_index
                `,
                [req.params.uid], async function(err, subs) {
                    if (err){
                        console.log(err)
                        res.status(400).send('An error occurred')
                    }else{
                        res.json(subs)
                    }
                }
            );
        }
    })
})

router.get("/component/:uid", async (req, res) => {
    //console.log('okk')
    pool.getConnection(async function(err, conn) {
        if (err){
            res.status(500).send('An error occurred')
            console.log(err)
        }else{
            conn.query(`SELECT c.component_id, m.title as mission_title, c.uid, c.header, c.body, c.type, c.created from Component c join Mission m on m.mission_id = c.mission_id where c.uid = ? and c.status = 0`,
                [req.params.uid],
                async function(err, component) {
                    if (err || component.length > 1){
                        console.log(err)
                        res.status(400).send('An error occurred')
                    }else if(component.length == 0){
                        res.status(404).send('Paper not found')
                    }else{
                        component = component[0]
                        conn.query(
                            `SELECT cc.child_component_index, c.uid, c.header, c.body, c.type, m.title as mission_title, c.created, count(cc1.component_connection_id) as subcomponents, p.unique_pagename from ComponentConnection cc 
                            join Component c on c.component_id = cc.child_component_id
                            join Mission m on m.mission_id = c.mission_id join Page p on m.page_id = p.page_id
                            left join ComponentConnection cc1 on cc1.component_id = c.component_id
                            where cc.component_id = ?
                            group by cc.component_connection_id
                            order by cc.child_component_index
                            `,
                            [component.component_id], async function(err, subs) {
                                if (err){
                                    console.log(err)
                                    res.status(400).send('An error occurred')
                                }else{
                                    delete component.component_id
                                    res.json({
                                        component: component,
                                        subComponents: subs
                                    })
                                }
                            }
                        );
                    }
                }
            );
        }
        pool.releaseConnection(conn);
    })
})



module.exports = router;