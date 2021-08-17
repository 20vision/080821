const { Storage } = require('@google-cloud/storage');
const path = require('path')
var keys = require('./keys');
const serviceKey = path.join(__dirname, './backend-320420-a6071e0a3928.json')

const storage = new Storage({
    keyFilename: serviceKey,
    projectId: keys.PROJECT_ID
})

const uploadFile = (data) => new Promise((res, rej) => {

    const file = storage.bucket(`${data.bucketname}`).file(`${data.timefolder}/${data.randomfolder}/${data.filename}`);
    file.save(data.buffer, (err) => {
        if(!err){
            const publicUrl = `${data.bucketname}/${data.timefolder}/${data.randomfolder}/`;
            res(publicUrl)
        }else{
            rej(err, 'Failed to upload File');
        }
    })
});

const deleteFile = (data) => new Promise((res, rej) => {
    async function deleteFile() {
        await storage.bucket(`${data.bucketname}`).getFiles({ prefix: `${data.timefolder}/${data.randomfolder}`}, function(err, files){
            for(var i in files){
                files[i].delete()
            }
        })
        res('deleted')
    }
      
    deleteFile().catch((err)=>{
        rej(err,'Failed to delete File')
    });
});

module.exports = {
    uploadFile,
    deleteFile
}