const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === "OPTIONS")
    {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

const products = require('./api/routes/product');
const orders = require('./api/routes/orders');
const user = require('./api/routes/user');

mongoose.connect('mongodb://riskyferyansyah:'+ process.env.MONGO_ATLAS_PW +'@project0-shard-00-00-wqide.mongodb.net:27017,project0-shard-00-01-wqide.mongodb.net:27017,project0-shard-00-02-wqide.mongodb.net:27017/test?ssl=true&replicaSet=Project0-shard-0&authSource=admin');

app.use('/products', products);
app.use('/orders', orders);
app.use('/user', user);

// Middleware for Handling Error
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    })
});

module.exports = app;