const { Storage } = require('@google-cloud/storage');
const path = require('path')
var keys = require('./keys');
const serviceKey = path.join(__dirname, './backend-320420-a6071e0a3928.json')

const storage = new Storage({
    keyFilename: serviceKey,
    projectId: keys.PROJECT_ID
})

const configBucket = storage.bucket('paper_images')

const uploadFile = (file) => new Promise((res, rej) => {
    const {originalname, buffer} = file;

    const blob = configBucket.file(originalname.replace(/ /g, '_'));

    const blobStream = blob.createWriteStream({
        resumable: true
    })

    blobStream.on('finish', async () => {
        const publicUrl = `https://storage.cloud.google.com/${configBucket.name}/${blob.name}`;
        await res(publicUrl);
    })
    .on('error', (err) => {
        console.error(err);
        rej(err, 'Failed to upload File');
    }).end(buffer);
});

module.exports = {
    uploadFile
}