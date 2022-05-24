const { uploadFile, deleteFile } = require("../config/storage");
const multer = require('multer')
const sharp = require('sharp')
var validator = require('validator');
let pool = require('../config/db');
const { random_string } = require("../utils/random");


exports.profile_picture = function(req, res, next) {
    const upload = multer({
        storage: multer.memoryStorage(),
        fileFilter: function (req, file, callback) {
            if(!validator.isBase64(file+'')){
                return callback(new Error('Only images are allowed'))
            }else{
                var ext = path.extname(file.originalname);
                if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
                    return callback(new Error('Only images are allowed'))
                }
                callback(null, true)
            }
            
        },
        limits: {
            fieldSize: 30 * 1024 * 1024
        }
    }).single('file')



    upload(req, res, async function (err) {
        if (err) {
            console.log(err)
            if(err.code == 'LIMIT_FIELD_VALUE'){
                res.status(422).send('File too large.')
            }else{
                console.log(err.code)
                res.status(500).send('An error occured while uploading your file')
            }
        }else{
            const uri = req.body.file.split(';base64,').pop()
            let imgBuffer = Buffer.from(uri, 'base64');

            let ratio = [400,200,48]
            
            let data = {
                bucketname: 'visionary_profile_picture',
                timefolder: (new Date()).getTime().toString(),
                randomfolder: await random_string(8)
            }

            try{

                for(var i=0; i<ratio.length;i++){
                    await sharp(imgBuffer)
                    .resize({ fit: sharp.fit.contain, width: ratio[i], height: ratio[i] })
                    .webp({ quality: 60 })
                    .toBuffer()
                    .then(async response => {
                        data.buffer = response,
                        data.filename = ratio[i].toString()+'x'+ratio[i].toString()+'.webp'

                        try{
                            req.imageUrl = await uploadFile(data)
                            console.log('upload',i)
                        }catch(error){
                            console.log(error)
                            res.status(500).send('An error occured while uploading file')
                        }

                    }).catch(err =>{
                        console.log("err: ",err);   
                        res.status(500).send() 
                    })
                }
                console.log('next')
                next()
            }catch(error){
                console.log('err: ',err)
                res.status(500).send()
            }

        }
    })
}

