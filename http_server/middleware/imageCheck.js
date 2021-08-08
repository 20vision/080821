const sharp = require('sharp');
const sizeOf = require('buffer-image-size')

exports.profile_picture = function(req, res, next) {

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
        next();
    }).catch(err =>{
        console.log("err: ",err);    
    });
};