const updateNestedForumSet = (conn, forumpost_parent_id, left, right) => new Promise((resolve, reject) => {
    console.log(forumpost_parent_id)
    conn.query(
        `Update ForumPost f set f.right =
        CASE 
            WHEN f.right >= ? THEN f.right + 2
            ELSE f.right
        END,
        f.left = 
        CASE
            WHEN f.left >= ? THEN f.left + 2
            ELSE f.left
        END 
        WHERE f.forumpost_parent_id = ?;`,
        [left, right, forumpost_parent_id],
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
    updateNestedForumSet
}