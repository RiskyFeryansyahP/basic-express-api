const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
    .populate('product', 'name')
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json({
            count : docs.length,
            orders : docs.map(doc => {
                return {
                    _id : doc._id,
                    product : doc.product,
                    quantity : doc.quantity,
                    request : {
                        type : "GET",
                        url : "http://localhost:3000/orders/"+doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({
            error : err
        })
    })
});

router.post('/', (req, res, next) => {
    const order = new Order({
        _id : new mongoose.Types.ObjectId(),
        quantity : req.body.quantity,
        product : req.body.productId
    })
    order.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            messages : "Order Stored",
            createdOrder : {
                _id : result._id,
                product : result.product,
                quantity : result.quantity
            },
            request : {
                type : "GET",
                url : "http://localhost:3000/orders/"+result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error : err });
    })
});

router.get('/:ordersId', (req, res, next) => {
    const id = req.params.ordersId;
    Order.findById(id)
    .select("_id product quantity")
    .populate('product')
    .exec()
    .then(order => {
        if(!order)
        {
            res.status(404).json({
                messages : "Order Not Found"
            })
        }
        res.status(200).json({
            order,
            request : {
                type : "GET",
                url : "http://localhost:3000/orders"
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({
            error : err
        })
    })
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Order.remove({ _id : id })
    .exec()
    .then(result => {
        res.status(200).json({
            messages : "Order Deleted",
            request : {
                type : "POST",
                url : "http://localhost:3000/orders",
                body : {
                    productId : "ID",
                    quantity : "Number"
                }
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
});

// router.delete('/:ordersId', (req, res, next) => {
//     res.status(200).json({
//         message : "Orders Deleting"
//     })
// });

module.exports = router;