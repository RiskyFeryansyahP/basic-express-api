const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message : "Orders were fetched"
    })
});

router.post('/', (req, res, next) => {
    const order = {
        productId : req.body.productId,
        quantity : req.body.quantity
    };

    res.status(201).json({
        message : "Order was a POST",
        order : order
    })
});

router.get('/:ordersId', (req, res, next) => {
    res.status(200).json({
        message : "Orders Detail",
        id : req.params.ordersId
    })
});

// router.delete('/:ordersId', (req, res, next) => {
//     res.status(200).json({
//         message : "Orders Deleting"
//     })
// });

module.exports = router;