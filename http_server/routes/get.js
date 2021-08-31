const router = require("express").Router();
const input_validation = require('../middleware/input_validation');
const checkAuth = require('../middleware/checkAuth')
let pool = require('../config/db');



// PRIVATE //////////////////////////////////////////////////

router.post("/username_unique", input_validation.checkRegexUsername, input_validation.checkUniqueUsername, async (req, res) => {
    res.status(200).send()
});

router.post("/pagename_unique", input_validation.checkRegexPagename, input_validation.checkUniquePagename, async (req, res) => {
    res.status(200).send()
});

router.get("/mission_title_unique/:pagename/:mission_title", input_validation.checkUniqueMissionTitle, async (req, res) => {
    res.status(200).send()
});

router.get("/my_pages/:page", checkAuth.required, async (req, res) => {
    if(req.user_id){
        pool.query(
            'SELECT p.page_icon, p.pagename, p.unique_pagename, p.vision FROM PageUser pu join Page p on pu.page_id = p.page_id where pu.user_id = ? order by pu.last_selected desc limit ?, 6;',
            [req.user_id, (parseInt(req.params.page)*6)],
            function(err, results) {
                if (err){
                    res.status(500).send('An error occurred')
                    console.log(err)
                }else{
                    let isLimit
                    if((results) && (results.length == 6)){
                        isLimit = (parseInt(req.params.page) + 1)
                    }else{
                        isLimit = null
                    }
                    res.json({
                        my_pages: results,
                        nextId: isLimit
                    })
                }
            }
        );
    }else{
        res.status(401).send()
    }
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


// PUBLIC //////////////////////////////////////////////////

router.get("/page/:page_name", checkAuth.optional, async (req, res) => {
    pool.query(
        'SELECT page_icon, pagename, unique_pagename, vision FROM Page where unique_pagename = ?;',
        [req.params.page_name],
        function(err, results) {
            if (err){
                res.status(500).send('An error occurred')
                console.log(err)
            }else if(results.length > 0){
                res.json({
                    page: results[0],
                })
            }else{
                res.status(404).send()
            }
        }
    );
})

module.exports = router;