
const getPageByName = (conn, unique_pagename) => new Promise((resolve, reject) => {
    conn.query(
        `SELECT page_id, 'p' as parent_type, page_icon, pagename, unique_pagename, token_mint_address, vision FROM Page where unique_pagename = ?;`,
        [unique_pagename],
        function(err, page) {
            if (err){
                reject({
                    status: 500,
                    message: 'An error occurred'
                })
                console.log(err)
            }else if(page.length == 0){
                reject({
                    status: 404,
                    message: 'Page not found'
                })
            }else{
                resolve(page[0])
            }
        }
    );
})

const getMission_s = (conn, unique_pagename, title) => new Promise((resolve, reject) => {
    conn.query(
        `SELECT ${title?'m.mission_id,':''} m.title, 'm' as parent_type, m.description, m.created from Mission m join Page p on p.page_id = m.page_id where p.unique_pagename = ? ${title?'and m.title = \''+title+'\'':''};`,
        [unique_pagename],
        function(err, mission_s) {
            if (err){
                reject({
                    status: 500,
                    message: 'An error occurred'
                })
                console.log(err)
            }else{
                if(!title){
                    resolve(mission_s)
                }else if((title && mission_s.length > 0)){
                    let mission_id = mission_s[0].mission_id
                    delete mission_s[0].mission_id
                    resolve(
                        {
                            mission: mission_s[0],
                            mission_id: mission_id
                        }
                    )
                }else{
                    reject({
                        status: 404,
                        message: 'Mission not found'
                    })
                }
            }
        }
    );
})

const getTopic_s = ({conn, unique_pagename}) => new Promise((resolve, reject) => {
    conn.query(
        `SELECT t.topic_id, 't' as parent_type, t.name, t.description, t.threshold from Topic t 
        join Page p on t.page_id = p.page_id and p.unique_pagename = ?
        group by t.topic_id
        order by (
            SELECT count(fp2.forumpost_id)* 1 + count(fpl.forum_post_like_id) from ForumPost fp2
            join ForumPost_Parent fpp on fpp.forumpost_parent_id = fp2.forumpost_parent_id and fpp.parent_type = 't' and fpp.parent_id = t.topic_id
            left join ForumPost_Like fpl on fpl.forumpost_id = fp2.forumpost_id
            group by t.topic_id
        ) desc limit 0,3`,
        [unique_pagename],
        function(err, topic_s) {
            if (err){
                reject({
                    status: 500,
                    message: 'An error occurred'
                })
                console.log(err)
            }else{
                resolve(topic_s)
            }
        }
    );
})


const getComponentIdFromUidUserPostPermission = ({conn, uid, user_id, allowAllUsers}) => new Promise((resolve, reject) => {
    conn.query(
        `SELECT c.component_id from Component c
        join Mission m on m.mission_id = c.mission_id 
        join Page p on p.page_id = m.page_id 
        join PageUser pu on pu.page_id = p.page_id
        where c.uid = ? ${allowAllUsers?'':'and pu.user_id = ?'}`,
        [uid, allowAllUsers?null:user_id],
        function(err, component_id) {
            if (err){
                reject({
                    status: 500,
                    message: 'An error occurred'
                })
                console.log(err)
            }else if(component_id && component_id.length == 1 && component_id[0].component_id){
                resolve(component_id[0].component_id)
            }else{
                reject({
                    status: 404,
                    message: 'Your Component was not found'
                })
            }
        }
    );
})


// const getForumPostParentInfo = (conn, parent_post_id) => new Promise((resolve, reject) => {
//     conn.query(
//         `SELECT fpp.parent_id, fpp.parent_type, fpp.forumpost_parent_id, fp.left, fp.right, fp.depth from ForumPost_Parent fpp
//         join ForumPost fp on fp.forumpost_parent_id = fpp.forumpost_parent_id where fp.forumpost_id = ?;`,
//         [parent_post_id],
//         function(err, forumpost_parent) {
//             if (err){
//                 reject({
//                     status: 500,
//                     message: 'An error occurred'
//                 })
//                 console.log(err)
//             }else{
//                 if(forumpost_parent.length == 0){
//                     reject({
//                         status: 404,
//                         message: 'Forum Post not found'
//                     })
//                 }else{
//                     console.log(forumpost_parent[0])
//                     //const forumpost_parent = forumpost_parent[0]
//                     conn.query(
//                         `SELECT p.token_mint_address from Page p 
//                         ${
//                             forumpost_parent[0].parent_type == 't'?
//                             'JOIN Topic t on p.page_id = t.page_id and t.topic_id = '+forumpost_parent[0].parent_id
//                         :forumpost_parent[0].parent_type == 'm'?
//                             'JOIN Mission m on m.page_id=p.page_id and m.mission_id = '+forumpost_parent[0].parent_id
//                         :forumpost_parent[0].parent_type == 'mp'?
//                             'JOIN Mission m on m.mission_id = p.page_id JOIN Component pa on pa.mission_id = m.mission_id and pa.component_id ='+forumpost_parent[0].parent_id
//                         :forumpost_parent[0].parent_type == 'p'?
//                             'where p.page_id='+forumpost_parent[0].parent_id
//                         :
//                             null
//                         };`,
//                         [],
//                         function(err, pagetokenmint) {
//                             if (err){
//                                 reject({
//                                     status: 500,
//                                     message: 'An error occurred'
//                                 })
//                                 console.log(err)
//                             }else{
//                                 if(pagetokenmint.length == 0){
//                                     reject({
//                                         status: 404,
//                                         message: 'Forum Post not found'
//                                     })
//                                 }else{
//                                     resolve({
//                                         forumpost_parent_id: forumpost_parent[0].forumpost_parent_id,
//                                         left: forumpost_parent[0].left,
//                                         right: forumpost_parent[0].right,
//                                         depth: forumpost_parent[0].depth,
//                                         token_mint_address: pagetokenmint[0].token_mint_address
//                                     })
//                                 }
//                             }
//                         }
//                     );
//                 }
//             }
//         }
//     );
// })


// const getForumPost = ({
//     conn, 
//     user_id, 
//     forumpost_parent_id, 
//     page_id,
//     topic_id, 
//     depth, 
//     left, 
//     right, 
//     offset, 
//     parent_id
// }) => new Promise((resolve, reject) => {
//     let base_parameters = []

//     // Rows
//     if(user_id != null){
//         base_parameters.push(user_id)
//     }

//     // Joins
//     if(parent_id != null){
//         base_parameters.push(parent_id)
//     }
//     if((forumpost_parent_id == null) && (page_id != null)){
//         base_parameters.push(page_id)
//     }
//     if(topic_id != null) base_parameters.push(topic_id)

//     // Where
//     base_parameters.push(depth)
//     if(forumpost_parent_id != null){
//         base_parameters.push(forumpost_parent_id)
//     }
//     if(left != null){
//         base_parameters.push(left)
//     }
//     if(right != null){
//         base_parameters.push(right)
//     }

    // const base_query = `
    //     SELECT
    //         fp2.depth
    //         ,fp2.left
    //         ,fp2.right
    //         ,fp2.forumpost_id
    //         ,fpp.parent_id
    //         ,fpp.parent_type
    //         ,fp2.forumpost_parent_id
    //         ,fp2.hex_color
    //         ,fp2.message
    //         ,fp2.created
    //         ,if(count(fpl2.forum_post_like_id)>0, true, false) as multipleLikes
    //         ,u.username
    //         ,u.profilePicture
    //         ${user_id != null?',if(count(fpl2.user_id = ?) > 0, true, false) as mylike':''}
    //     from ForumPost fp2
//         join User u on u.user_id = fp2.user_id
//         join (
//             SELECT ((count(fpl3.forum_post_like_id) + 1) / POW((SUM(TIMESTAMPDIFF(HOUR, fp3.created, now()))/count(fp3.forumpost_id))+2, 1.5)) as value, fp.forumpost_id from ForumPost fp
//             join ForumPost fp3 on fp3.left >= fp.left and fp3.right <= fp.right and fp3.forumpost_parent_id = fp.forumpost_parent_id 
//             left join ForumPost_Like fpl3 on fp3.forumpost_id = fpl3.forumpost_id
//             group by fp.forumpost_id
//         ) as score on score.forumpost_id = fp2.forumpost_id
//         left join ForumPost_Like fpl2 on fpl2.forumpost_id = fp2.forumpost_id
//         ${(parent_id != null)?'join ForumPost fp4 on fp4.forumpost_id = ? and fp4.forumpost_parent_id = fp2.forumpost_parent_id and fp4.left < fp2.left and fp4.right > fp2.right':''}
//         ${((forumpost_parent_id == null) && (page_id != null))?'join ForumPost_Parent fpp on fpp.forumpost_parent_id = fp2.forumpost_parent_id and fpp.parent_id = ? and fpp.parent_type = \'p\'':
//         (topic_id != null)?'join ForumPost_Parent fpp on fpp.forumpost_parent_id = fp2.forumpost_parent_id and fpp.parent_id = ? and fpp.parent_type = \'t\'':
//         'join ForumPost_Parent fpp on fpp.forumpost_parent_id = fp2.forumpost_parent_id'}
//         where fp2.depth = ?
//         ${forumpost_parent_id != null?' and fp2.forumpost_parent_id = ?':''}
//         ${left != null?' and fp2.left > ?':''}
//         ${right != null?' and fp2.right < ?':''}
//         group by fp2.forumpost_id
//         order by score.value desc limit ?,3`
//     base_parameters.push((offset?offset*3:0))  

//     conn.query(
//         base_query,
//         base_parameters,
//         function(err, query_content) {
//             if (err){
//                 console.log(err)
//                 reject({
//                     status: 500,
//                     message: 'An error occurred'
//                 })
//             }else{
//                 resolve(query_content)
//             }
//         }
//     );
// })

module.exports = {
    getPageByName,
    getMission_s,
    getTopic_s,
    getComponentIdFromUidUserPostPermission
    // getForumPostParentInfo,
    // getForumPost
}