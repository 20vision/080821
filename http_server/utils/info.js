const getForumInfo = (conn, req) => new Promise((res, rej) => {
    if((req.body.subject == 0) && !req.body.parent_key && req.body.unique_pagename){
        conn.query(
            'SELECT page_id from Page p where p.unique_pagename = ?;',
            [req.body.unique_pagename],
            async function(err, page_result) {
                if (err || (page_result.length == 0)){
                    rej({
                        status: 500,
                        message: 'An error occurred'
                    })
                }else{
                    res({id: page_result[0].page_id})
                }
            }
        );
    }else{
        rej({
            status: 422,
            message: 'Invalid Parameters provided'
        })
    }
})

const getBasicForumSetup = (conn, req) => new Promise((resolve, reject) => {
    conn.query(
        'SELECT page_icon, vision FROM Page where unique_pagename = ?;',
        [req.params.unique_pagename],
        async function(err, page_result) {
            if (err){
                reject({
                    status: 500,
                    send: 'An error occurred'
                })
                console.log(err)
            }else if(page_result.length > 0){
                
                if((req.params.t_or_m == 'm') && (req.params.mission_title_or_topic_name != 'undefined')){
                    conn.query(
                        'SELECT m.title, m.description, m.created from Mission m join Page p on m.page_id = p.page_id and p.unique_pagename = ? and m.title = ?;',
                        [req.params.unique_pagename, req.params.mission_title_or_topic_name],
                        async function(err, mission_result) {
                            if (err){
                                res.status(500).send('An error occurred')
                                console.log(err)
                            }else if(mission_result.length > 0){
                                if(req.params.paper_uid != 'undefined'){
                                    // QUERY PAPER PARAMETERS
                                }else{
                                    resolve({
                                        page: page_result[0],
                                        mission: mission_result[0]
                                    })
                                }
                            }else{
                                res.status(404).send()
                            }
                        }
                    );
                }else{
                    resolve({page: page_result[0]})
                }

            }else{
                res.status(404).send()
            }
        }
    );
})

const contentWithParent = (conn, parent_id, parent_type) => new Promise((resolve, reject) => {

})

module.exports = {
    getForumInfo,
    getBasicForumSetup
}