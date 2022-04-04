const { random_string } = require("./random");

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

const forumpost = ({conn, forumpost_parent_id, left, right, depth, message, user_id, hex_color}) => new Promise(async (resolve, reject) => {
    let random = await random_string(8)

    conn.query(
        `INSERT into ForumPost values(?,?,?,?,?,?,?,?,?,now());`,
        [
            null, 
            ((new Date()).getTime().toString()+random),
            forumpost_parent_id, 
            left, 
            right, 
            depth, 
            message, 
            user_id, 
            hex_color
        ],
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