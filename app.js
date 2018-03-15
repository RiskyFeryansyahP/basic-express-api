const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));

const products = require('./api/routes/product');
const orders = require('./api/routes/orders');

app.use('/products', products);
app.use('/orders', orders);

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