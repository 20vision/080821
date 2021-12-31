const forumpost_parent = (conn, id, type) => new Promise((resolve, reject) => {
    conn.query(
        `INSERT into ForumPost_Parent values(?,?,?);`,
        [null,id,type],
        function(err, insert) {
            if (err){
                console.log(err)
                reject({
                    status: 500,
                    message: 'An error occurred'
                })
            }else{
                resolve(insert.insertId)
            }
        }
    );
})

const forumpost = (conn, forumpost_parent_id, left, right, message, user_id, hex_color, user_token_impact_per_mission) => new Promise((resolve, reject) => {
    conn.query(
        `INSERT into ForumPost values(?,?,?,?,?,?,?,?,now());`,
        [null,forumpost_parent_id, left, right, message, user_id, hex_color, user_token_impact_per_mission],
        function(err, insert) {
            if (err){
                console.log(err)
                reject({
                    status: 500,
                    message: 'An error occurred'
                })
            }else{
                resolve(insert.insertId)
            }
        }
    );
})


module.exports = {
    forumpost_parent,
    forumpost
}