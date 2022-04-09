//Express Basic
const express = require('express')
const app = express()
app.use(express.json({limit: '5mb'}));

const port = 8080

const cookieParser = require('cookie-parser')
    app.use(cookieParser())

//Tools
const useragent = require('express-useragent');
    app.use(useragent.express());


app.disable('x-powered-by');

//Routes
const wallet = require("./routes/wallet");
    app.use('/wallet', wallet)

const get = require("./routes/get");
    app.use('/get', get)

const post = require("./routes/post");
    app.use('/post', post)

const update = require("./routes/update")
    app.use('/update', update)


// Run Server on Port
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
