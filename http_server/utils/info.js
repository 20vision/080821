
const getPageByName = (conn, unique_pagename) => new Promise((resolve, reject) => {
    conn.query(
        `SELECT page_id, page_icon, pagename, unique_pagename, vision FROM Page where unique_pagename = ?;`,
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

module.exports = {
    getPageByName,
    getMission_s
}