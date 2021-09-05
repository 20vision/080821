const router = require("express").Router();
const cloudStorage = require('../middleware/cloudStorage')
const check = require('../middleware/check')
const pool = require('../config/db');
const input_validation = require('../middleware/input_validation');

router.post("/profile_picture", check.AuthRequired, cloudStorage.profile_picture, async (req, res) => {
    if(!req.user_id){
        res.status(401).send('Not authenticated')
    }else if(!req.imageUrl){
        res.status(500).send('An error occured. Please try again later')
    }else{
        res.json({url: req.imageUrl})
    }
});

router.post("/username", check.AuthRequired, input_validation.checkRegexUsername, input_validation.checkUniqueUsername, async (req, res) => {
    if(req.user_id){
        pool.query(
            'UPDATE User set username = ? where user_id = ?;',
            [req.body.username,req.user_id],
            function(err, results) {
                if (err){
                    res.status(500).send('An error occurred')
                    console.log(err)
                }else{
                    res.status(200).send()
                }
            }
        );
    }else{
        res.status(401).send('Not Authenticated')
    }

})


module.exports = router;