const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');

router.get('/', (req, res, next) => {
    Order
        .find()
        .select('product _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders/" + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                title: req.body.title,
                product: req.body.product,
                create_user: req.body.create_user,
                product_owner: req.body.product_owner,
                type: req.body.type,
                category: req.body.category,
                add_type: req.body.add_type,
                price: req.body.price,
                phone: req.body.cphone,
                time: req.body.time,
                datetime: req.body.datetime,
                status: 'false',
                image: req.body.image,
                lang: req.body.lang,
                long: req.body.long,
                clang: req.body.clang,
                clong: req.body.clong,
                cphone: req.body.cphone
            });
            order.save()
                .then(result => {
                    res.status(201).json({
                        code: 201,
                        id: req.body.product_owner
                    });
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {
            error: err
        });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .exec()
        .then(order => {
            res.status(200).json({
                order: order
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// find by user id and type
router.post('/search', (req, res, next) => {
    const user = req.body.user;
    const type = req.body.add_type;
    Order.find({ create_user: user, add_type: type })
        .exec()
        .then(order => {
            res.status(200).json({
                orders: order
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//serach for buyer
router.post('/search/buyer', (req, res, next) => {
    const user = req.body.user;
    const type = req.body.add_type;
    Order.find({ product_owner: user, add_type: type })
        .exec()
        .then(order => {
            res.status(200).json({
                orders: order
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/update', (req, res, next) => {
    const orderId = req.body.orderId;

    Order.update({ _id: orderId }, { $set: { status: 'true' } })
        .exec()
        .then(result => {
            res.status(200).json({
                code: 201
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:orderId', (req, res, next) => {
    Order.remove({
        _id: req.params.orderId
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order deleted"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;