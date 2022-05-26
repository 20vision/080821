var keys = require('../config/keys');
const jwt = require('jsonwebtoken');
const req = require('express/lib/request');
var usernameRe = /^[a-z0-9_.]{0,30}$/

const validate_username = (conn, username) => new Promise((resolve, reject) => {
  if(usernameRe.test(username)){
  
    if(username.length < 4){
      reject({
        statusCode: 422,
        statusMsg: "Username not available"
      })
    }else{
        conn.query("SELECT if(count(user_id)>0,false,true) as uniqueUsername from User where username = ?", [username], 
        function(err, rows, fields) {
            if (err){
              reject({
                statusCode: 500,
                statusMsg: 'An error occurred'
              })
              console.log(err)
            }else{
                if(rows[0].uniqueUsername == true){
                  resolve()
                }else{
                  reject({
                    statusCode: 422,
                    statusMsg: 'Username already taken'
                  })
                }
            }
        });
    }
  }else{
    reject({
      statusCode: 422,
      statusMsg: 'Usernames can only contain lowercase letters, numbers, dots and underscores'
    })
  }
})

const create_user = (useragent, conn, username, publicKeyString) => new Promise(async (resolve, reject) => {
  try{
    await validate_username(conn, username)
    conn.query(
      'INSERT INTO User values (?,?,?,?,now());',
      [null, publicKeyString, username, null, null],
        function(err, results) {
            if (err){
              reject({
                statusCode: 500,
                statusMsg: 'An error occurred'
              })
            }else{
                conn.query(
                    'INSERT INTO User_Session values (?,?,?,now());',
                    [null, results.insertId, useragent && useragent.platform&&useragent.browser?(useragent.platform+' · '+useragent.browser):'Unknown', null],
                    function(err, results) {
                        if (err){
                          reject({
                            statusCode: 500,
                            statusMsg: 'An error occurred'
                          })
                        }else{
                          var token = jwt.sign({session_id: results.insertId}, keys.JWT_SECRET);
                          resolve(token)
                        }
                    }
                );
            }
        }
    );
  }catch(e){
    if(e.statusCode && e.statusMsg){
      reject({
        statusCode: e.statusCode,
        statusMsg: e.statusMsg
      })
    }else{
      reject({
        statusCode: 400,
        statusMsg: 'An error occurred'
      })
    }
  }
});

const login_user = (useragent, conn, publicKeyString) => new Promise(async (resolve, reject) => {
  try{
    conn.query(
      'SELECT user_id from User where public_key = ?',
        [publicKeyString],
        function(err, results) {
            if (err){
              reject({
                statusCode: 500,
                statusMsg: 'An error occurred'
              })
              console.log(err)
            }else if(results.length == 0){
              reject({
                statusCode: 422,
                statusMsg: 'User not found'
              })
            }else{
                conn.query(
                    'INSERT INTO User_Session values (?,?,?,now());',
                    [null, results[0].user_id, useragent && useragent.platform&&useragent.browser?(useragent.platform+' · '+useragent.browser):'Unknown', null],
                    function(err, results) {
                        if (err){
                          reject({
                            statusCode: 500,
                            statusMsg: 'An error occurred'
                          })
                          console.log(err)
                        }else{
                          var token = jwt.sign({session_id: results.insertId}, keys.JWT_SECRET);
                          resolve(token)
                        }
                    }
                );
            }
        }
    );
  }catch(e){
    if(e.statusCode && e.statusMsg){
      reject({
        statusCode: e.statusCode,
        statusMsg: e.statusMsg
      })
    }else{
      reject({
        statusCode: 400,
        statusMsg: 'An error occurred'
      })
    }
  }
  
});

module.exports = {
    create_user,
    login_user
}