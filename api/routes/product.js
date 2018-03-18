const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
    .select("name price _id")
    .exec()
    .then(docs => {
        const response = {
            count : docs.length,
            products : docs.map(doc => {
                return {
                    name : doc.name,
                    price : doc.price,
                    _id : doc._id,
                    request : {
                        type : "GET",
                        url : "http://localhost:3000/products/" + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(404).json(
            {
                error : err
            }
        )
    });
});

router.post('/', (req, res, next) => {
    const product = new Product(
        {
            _id : new mongoose.Types.ObjectId(),
            name : req.body.name,
            price : req.body.price
        }
    )
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message : "Create new Products Susccessfuly",
            createdProduct : {
                name : result.name,
                price : result.price,
                _id : result._id,
                request : {
                    type : "GET",
                    url : "http://localhost:3000/products/" + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error : err });
    });
});

router.get('/:productsId', (req, res, next) => {
    const id = req.params.productsId;

    Product.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc)
        {
            res.status(200).json({
                product : doc,
                request : {
                    type : "GET",
                    url : "http://localhost:3000/products/"
                }
            });
        }
        else
        {
            res.status(404).json({ message : "No Valid Entry Found for ProductId" });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    });
});

router.patch('/:productsId', (req, res, next) => {
    const id = req.params.productsId;
    const updateOps = {};
    for(const ops of req.body)
    {
        updateOps[ops.propName] = ops.value;
    }
    
    Product.update(
        {
            _id : id
        },
        {
            $set : updateOps /* {
                name : req.body.newName,
                price : req.body.newPrice
            }
            */
        }
    )
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message : "Product Updated",
            request : {
                type : "GET",
                url : "http://localhost:3000/products/"+id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(
            {
                error : err
            }
        )
    });
});

router.delete('/:productsId', (req, res, next) => {
    const id = req.params.productsId;
    Product.remove({ _id : id })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message : "Product Deleted",
            request : {
                type : "POST",
                url : "http://localhost:3000/products/",
                data : {
                    name : "String",
                    price : "Number"
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(
            {
                error : err
            }
        )
    }); 
})

module.exports = router;