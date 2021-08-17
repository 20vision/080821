const { uploadFile, deleteFile } = require("../config/storage");
const multer = require('multer')
const sharp = require('sharp')
let pool = require('../config/db');
const { random_image_id } = require("../config/random");

exports.profile_picture = function(req, res, next) {
    const upload = multer({
        storage: multer.memoryStorage(),
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
                return callback(new Error('Only images are allowed'))
            }
            callback(null, true)
        },
        limits: {
            fieldSize: 10 * 1024 * 1024
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
                randomfolder: await random_image_id(8)
            }

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
                    }catch(error){
                        console.log(error)
                        res.status(500).send('An error occured while uploading file')
                    }

                }).catch(err =>{
                    console.log("err: ",err);   
                    res.status(500).send() 
                })
            }
            

            pool.getConnection(function(err, conn) {
                if (err){
                    res.status(500).send('An error occurred')
                    console.log(err)
                }else{
                    conn.query(
                        'SELECT profilePicture from User where user_id=?;',
                        [req.user_id],
                        function(err, oldProfilePicture) {
                            if (err){
                                res.status(500).send('An error occurred')
                                console.log(err)
                            }else{
                                conn.query(
                                    'UPDATE User set profilePicture=? where user_id=?;',
                                    [req.imageUrl, req.user_id],
                                    async function(err, results) {
                                        if (err){
                                            res.status(500).send('An error occurred')
                                            console.log(err)
                                        }
                                        if(oldProfilePicture[0]){
                                            try{
                                                oldProfilePicture = oldProfilePicture[0].profilePicture
                                                oldProfilePicture = oldProfilePicture.split("/")
                                                let delData ={
                                                    bucketname: oldProfilePicture[0],
                                                    timefolder: oldProfilePicture[1],
                                                    randomfolder: oldProfilePicture[2]
                                                }
                                                await deleteFile(delData)
                                                next()
                                            }catch(error){
                                                throw error
                                            }
                                        }
                                        
                                    }
                                );
                            }
                        }
                    );
                }
                pool.releaseConnection(conn);
            })


        }
    })
}

