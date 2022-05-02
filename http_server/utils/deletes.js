const storage = require("../config/storage")

const ComponentAuthRequired = ({conn, component_id, timefolder, randomfolder}) => new Promise((resolve, reject) => {
    conn.query(
        `DELETE from Component where component_id = ?`,
        [component_id],
        async function(err, deleted) {
            if (err){
                reject({
                    status: 500,
                    message: 'An error occurred'
                })
                console.log(err)
            }else{
                try{
                    await storage.deleteFile({
                        bucketname: 'comp_images',
                        timefolder,
                        randomfolder
                    })
                    resolve()
                }catch(err){
                    console.log(err)
                    resolve()
                }
            }
        }
    );
})

module.exports = {
    ComponentAuthRequired
}