//Express Basic
const express = require('express')
const app = express()
app.use(express.json({limit: '5mb'}));

const check = require('./middleware/check')

const port = 8080

const cookieParser = require('cookie-parser')
    app.use(cookieParser())

//Tools
const useragent = require('express-useragent');
    app.use(useragent.express());

const cors = require("cors");
    app.use(
        cors({
            origin: true,
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            credentials: true
        })
    );

app.disable('x-powered-by');

//Routes
const wallet = require("./routes/wallet");
    app.use('/wallet', check.LastDelivered, wallet)

const get = require("./routes/get");
    app.use('/get', check.LastDelivered, get)

const post = require("./routes/post");
    app.use('/post', check.LastDelivered, post)

const update = require("./routes/update")
    app.use('/update', check.LastDelivered, update)


// Run Server on Port
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
