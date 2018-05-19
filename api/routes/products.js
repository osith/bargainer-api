const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function (req, file, cd) {
        cd(null, './uploads/');
    },
    filename: function (req, file, cd) {
        cd(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

//all services
router.get('/', (req, res, next) => {
    Product.find()
        .select('title price _id productImage time')
        .exec()
        .then(docs => {
            const responce = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        title: doc.title,
                        price: doc.price,
                        time: doc.time,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + doc._id
                        }
                    }
                })
            }
            res.status(200).json(responce);
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json(err);
        });
});

// update images
router.post('/image/:productId', upload.single('productImage'), (req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndUpdate(
        id,
        { $push: { productImage: (req.file.path).replace('\\', '/') } },
        { safe: true, upsert: true }
    ).exec()
        .then(result => {
            res.status(200).json({
                message: "Product updated"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//post single service
router.post('/', (req, res, next) => {
    //const id = req.params.productId;
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        price: req.body.price,
        time: req.body.time,
        location: req.body.location,
        lang: req.body.lang,
        long: req.body.long,
        contact: req.body.contact,
        email: req.body.email,
        category: req.body.category,
        user: req.body.user
    });
    product
        .save()
        .then(result => {
            res.status(201).json({
                id: result._id
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//get single service
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('title price _id productImage description location lang long contact time type email category user')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc
                });
            } else {
                res.status(404).json({ message: "Not valid entry found!" });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//get from category short, long, service
router.get('/category/:category', (req, res, next) => {
    const category = req.params.category;
    Product.find({ category: category })
        .select('title price _id productImage description location lang long contact time type email category user')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc
                });
            } else {
                res.status(404).json({ message: "Not valid entry found!" });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//update service
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const uid = req.body.user;
    const updateOps = {};
    /*for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }*/
    Product.update({ _id: id }, { $set: { user: uid } })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//delete service
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({
        _id: id
    }).exec()
        .then(result => {
            res.status(200).json({
                message: "Product Deleted"
            });
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

//advance search
router.post('/search', (req, res, next) => {
    const keyword = (req.body.keyword).toUpperCase();
    const category = req.body.category;
    const type = req.body.type;
    const location = req.body.location;

    Product.find({ location: new RegExp(location), title: new RegExp(keyword), type: new RegExp(type), category: new RegExp(category) })
        .select('title price _id productImage description location lang long contact time type email category user')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc
                });
            } else {
                res.status(404).json({ message: "Not valid entry found!" });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


module.exports = router;