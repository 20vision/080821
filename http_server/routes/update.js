const router = require("express").Router();
const upload = require('./upload')

router.post("/profile_picture", upload.profile_picture, async (req, res) => {
    if(req.user_id){
        try{
            const imageUrl = await uploadFile(req.file)
            res.json({url: imageUrl})
        }catch(error){
            throw error
        }
    }else{
        res.status(401).send('Not authenticated')
    }
});


module.exports = router;