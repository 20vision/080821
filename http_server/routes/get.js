const router = require("express").Router();
const input_validation = require('../middleware/input_validation');
const checkAuth = require('../middleware/checkAuth')
let pool = require('../config/db');

// Sending wallet "public key" as user_id and checking if user already in db -> send cookie. If not -> return new
router.post("/username_unique", input_validation.checkRegexUsername, input_validation.checkUniqueUsername, async (req, res) => {
    res.status(200).send()
});

router.post("/pagename_unique", input_validation.checkRegexPagename, input_validation.checkUniquePagename, async (req, res) => {
    res.status(200).send()
});

router.get("/user_profile", checkAuth.optional, async (req, res) => {
    if(req.user_id){
        pool.query(
            'SELECT u.username, u.profilePicture FROM User u where u.user_id = ?;',
            [req.user_id],
            function(err, results) {
                if (err){
                    res.status(500).send('An error occurred')
                    console.log(err)
                }else{
                    res.json({
                        username: results[0].username,
                        profilePicture: results[0].profilePicture
                    })
                }
            }
        );
    }else{
        res.json({
            username: null,
            profilePicture: null
        })
    }
    
})

module.exports = router;