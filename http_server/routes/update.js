const router = require("express").Router();
const cloudStorage = require('../middleware/cloudStorage')
const checkAuth = require('../middleware/checkAuth')

router.post("/profile_picture", 
checkAuth.required,
cloudStorage.profile_picture, 
async (req, res) => {

    if(!req.user_id){
        res.status(401).send('Not authenticated')
    }else if(!req.imageUrl){
        res.status(500).send('An error occured. Please try again later')
    }else{
        res.json({url: req.imageUrl})
    }
});


module.exports = router;