const { uploadFile, deleteFile } = require("../config/storage");
const multer = require('multer')
const sharp = require('sharp')
var validator = require('validator');
let pool = require('../config/db');
const { random_image_id } = require("../config/random");


exports.paper_image = function(req, res, next) {
    
    const upload = multer({
        storage: multer.memoryStorage(),
        fileFilter: function (req, file, callback) {
            if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
                return callback(new Error('Only images are allowed'))
            }
            callback(null, true)
        },
        limits: {
            fieldSize: 5 * 1024 * 1024
        }
    }).single('filepond')
    
    upload(req, res, async function (err) {
        if (err) {
            if(err.code == 'LIMIT_FIELD_VALUE'){
                res.status(422).send('File too large.')
            }else{
                console.log(err.code)
                res.status(500).send('An error occured while uploading your file')
            }
        }else{
            let ratio = [512]
            
            let data = {
                bucketname: 'paper_images',
                timefolder: (new Date()).getTime().toString(),
                randomfolder: await random_image_id(8)
            }

            for(var i=0; i<ratio.length;i++){
                await sharp(req.file.buffer)
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
                    if(req.paper_id){
                        conn.query(
                            'SELECT pv.paper_version_id from Paper_Version pv where pv.version = ? and pv.paper_id = ?;',
                            ['0.0.0',req.paper_id],
                            function(err, results) {
                                if (err){
                                    res.status(500).send('An error occurred')
                                    console.log(err)
                                }else{
                                    if(results[0] && results[0].paper_version_id){
                                        /*
                                        Use paper_version_id to either append new Media or update old Media with same version id
                                        */
                                        conn.query(
                                            'SELECT pm.content from Paper_Media pm where pm.paper_version_id = ?;',
                                            [results[0].paper_version_id],
                                            async function(err, resultsPaperMediaContent) {
                                                if (err){
                                                    res.status(500).send('An error occurred')
                                                    console.log(err)
                                                }else{
                                                    /*
                                                    If there already is a media on that paper version -> update, otherwise insert
                                                    */
                                                    if(resultsPaperMediaContent[0] && resultsPaperMediaContent[0].content){
                                                        const paperMedia = resultsPaperMediaContent[0].content.split('/')
                                                        const mediaData = {
                                                            bucketname: paperMedia[0],
                                                            timefolder: paperMedia[1],
                                                            randomfolder: paperMedia[2]
                                                        }
                                                        try{
                                                            await deleteFile(mediaData)
                                                        }catch(error){
                                                            console.log(error)
                                                            res.status(500).send('An error occured')
                                                        }
                                                        conn.query(
                                                            'UPDATE Paper_Media pm set pm.content = ? where pm.paper_version_id = ?;',
                                                            [req.imageUrl, results[0].paper_version_id],
                                                            function(err, results) {
                                                                if (err){
                                                                    res.status(500).send('An error occurred')
                                                                    console.log(err)
                                                                }else{
                                                                    next()
                                                                }
                                                            }
                                                        );
                                                    }else{
                                                        conn.query(
                                                            'INSERT into Paper_Media values (?,?,?);',
                                                            [null, req.imageUrl, results[0].paper_version_id],
                                                            function(err, results) {
                                                                if (err){
                                                                    res.status(500).send('An error occurred')
                                                                    console.log(err)
                                                                }else{
                                                                    next()
                                                                }
                                                            }
                                                        );
                                                    }
                                                }
                                            }
                                        );
                                    }else if(req.paper_id){
                                        /*
                                        If no paper_version_id available at 0.0.0 -> no edit version -> create new one Use paper_version_id to either append new Media or update old Media with same version id
                                        */
                                        conn.query(
                                            'INSERT into Paper_Version values (?,?,?,?,now());',
                                            [null, req.paper_id, '0.0.0', null, null],
                                            function(err, resultsPaperVersion) {
                                                if (err){
                                                    res.status(500).send('An error occurred')
                                                    console.log(err)
                                                }else{
                                                    conn.query(
                                                        'INSERT into Paper_Media values (?,?,?);',
                                                        [null, req.imageUrl, resultsPaperVersion.insertId],
                                                        function(err, results) {
                                                            if (err){
                                                                res.status(500).send('An error occurred')
                                                                console.log(err)
                                                            }else{
                                                                next()
                                                            }
                                                        }
                                                    );
                                                }
                                            }
                                        );
                                    }
                                }
                            }
                        );
                    }else if(req.query.mission_title && req.query.page_name){
                        conn.query(
                            'INSERT into Paper values (?,?,?,?);',
                            [null, data.timefolder, req.mission_id, 1],
                            function(err, results) {
                                if (err){
                                    res.status(500).send('An error occurred')
                                    console.log(err)
                                }else{
                                    conn.query(
                                        'INSERT into Paper_Version values (?,?,?,?,now());',
                                        [null, results.insertId, '0.0.0', null, null],
                                        function(err, resultsPaperVersion) {
                                            if (err){
                                                res.status(500).send('An error occurred')
                                                console.log(err)
                                            }else{
                                                conn.query(
                                                    'INSERT into Paper_Media values (?,?,?);',
                                                    [null, req.imageUrl, resultsPaperVersion.insertId],
                                                    function(err, results) {
                                                        if (err){
                                                            res.status(500).send('An error occurred')
                                                            console.log(err)
                                                        }else{
                                                            req.paper_uid = data.timefolder
                                                            next()
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    );
                                }
                            }
                        );
                    }else{
                        res.status(400).send('An error occured, paper not updated')
                    }
                    
                }
                pool.releaseConnection(conn);
            })


        }
    })
    
}


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
            fieldSize: 5 * 1024 * 1024
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
                                        if(oldProfilePicture[0].profilePicture){
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
                                        }else{
                                            next()
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

