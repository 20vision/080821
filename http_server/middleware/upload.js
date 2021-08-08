const { uploadFile } = require("../config/storage");

const multer = require('multer')

const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


exports.profile_picture = function(req, res, next) {
    multerMid.single('file')

    let fileformat = req.file.originalname.split('.')[1]
    let outputImage = ''+(new Date()).getTime() + '.webp'
    var newSize = null

    req.file.originalname = outputImage

    if(sizeOf(req.file.buffer).height > sizeOf(req.file.buffer).width){
        newSize = sizeOf(req.file.buffer).width
    }else{
        newSize = sizeOf(req.file.buffer).height
    }

    sharp(req.file.buffer)
    .resize({ width: newSize, height: newSize })
    .webp({ quality: 60 })
    .toBuffer()
    .then(data => {
        req.file.buffer = data
        try{
            req.imageUrl = await uploadFile(req.file)
            next();
        }catch(error){
            throw error
        }
    }).catch(err =>{
        console.log("err: ",err);    
    });
}