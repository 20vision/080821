
const getPageByName = (conn, unique_pagename) => new Promise((resolve, reject) => {
    conn.query(
        `SELECT page_id, page_icon, pagename, unique_pagename, token_mint_address, vision FROM Page where unique_pagename = ?;`,
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
                let page_id = page[0].page_id
                delete page[0].page_id
                resolve({
                    page_id: page_id,
                    page: page[0]
                })
            }
        }
    );
})

const getMission_s = (conn, unique_pagename, title) => new Promise((resolve, reject) => {
    conn.query(
        `SELECT ${title?'m.mission_id,':''} m.title, m.description, m.created from Mission m join Page p on p.page_id = m.page_id where p.unique_pagename = ? ${title?'and m.title = \''+title+'\'':''};`,
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

const getForumPostParentInfo = (conn, parent_post_id) => new Promise((resolve, reject) => {
    conn.query(
        `SELECT fpp.parent_id, fpp.parent_type, fp.left, fp.right from ForumPost_Parent fpp
        join ForumPost fp on fp.forumpost_parent_id = fpp.forumpost_parent_id where fp.forumpost_id = ?;`,
        [parent_post_id],
        function(err, forumpost_parent) {
            if (err){
                reject({
                    status: 500,
                    message: 'An error occurred'
                })
                console.log(err)
            }else{
                if(forumpost_parent.length == 0){
                    reject({
                        status: 404,
                        message: 'Forum Post not found'
                    })
                }else{
                    const forumpost_parent = forumpost_parent[0]
                    conn.query(
                        `SELECT p.token_mint_address from Page p 
                        ${
                        forumpost_parent.parent_type == 't'?
                            'JOIN Topics t on p.page_id = t.page_id and t.topic_id = '+forumpost_parent.parent_id
                        :forumpost_parent.parent_type == 'm'?
                            'JOIN Mission m on m.page_id=p.page_id and m.mission_id = '+forumpost_parent.parent_id
                        :forumpost_parent.parent_type == 'mp'?
                            'JOIN Mission m on m.mission_id = p.page_id JOIN Paper pa on pa.mission_id = m.mission_id and pa.paper_id ='+forumpost_parent.parent_id
                        :forumpost_parent.parent_type == 'p'?
                            'where p.page_id='+forumpost_parent.parent_id
                        :
                            null
                        };`,
                        [],
                        function(err, pagetokenmint) {
                            if (err){
                                reject({
                                    status: 500,
                                    message: 'An error occurred'
                                })
                                console.log(err)
                            }else{
                                if(pagetokenmint.length == 0){
                                    reject({
                                        status: 404,
                                        message: 'Forum Post not found'
                                    })
                                }else{
                                    resolve({
                                        forumpost_parent_id: forumpost_parent[0].forumpost_parent_id,
                                        left: forumpost_parent[0].left,
                                        right: forumpost_parent[0].right,
                                        token_mint_address: pagetokenmint[0].token_mint_address
                                    })
                                }
                            }
                        }
                    );
                }
            }
        }
    );
})

module.exports = {
    getPageByName,
    getMission_s,
    getForumPostParentInfo
}