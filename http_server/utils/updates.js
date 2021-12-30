const updateNestedForumSet = (conn, forumpost_parent_id, right) => new Promise((resolve, reject) => {
    conn.query(
        `Update Forum set right = right+2 where forumpost_parent_id = ? and right > ?;`,
        [null, forumpost_parent_id, right],
        function(err, insert) {
            if (err){
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
    updateNestedForumSet
}