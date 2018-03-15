const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message : "Handling a Get Method"
    })
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message : "Handling a POST Method"
    })
});

router.get('/:productsID', (req, res, next) => {
    const id = req.params.productsID;
    res.status(200).json({
        message : "Handling an Params Id",
        id : id
    })
});

router.patch('/:productsID', (req, res, next) => {
    res.status(200).json({
        message : "Get Update"
    })
});

router.delete('/:productsID', (req, res, next) => {
    res.status(200).json({
        message : "Get a Delete"
    })  
})

module.exports = router;