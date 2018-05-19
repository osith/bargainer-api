const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.get('/', (req, res, next) => {
    User
        .find()
        .select('email password _id first_name last_name display_name contact_no type push comments')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        _id: doc._id,
                        email: doc.email,
                        password: doc.password,
                        first_name: doc.first_name,
                        last_name: doc.last_name,
                        display_name: doc.display_name,
                        contact_no: doc.contact_no,
                        type: doc.type,
                        push: doc.push,
                        comments: doc.comments
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

//get single user
router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .select('first_name last_name email contact_no display_name type _id push comments')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    user: doc
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

router.post('/signup', (req, res, next) => {

    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            display_name: req.body.display_name,
                            contact_no: req.body.contact_no,
                            type: req.body.type
                        });
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User created',
                                    code: 200
                                });
                            })
                            .catch(err => {
                                error: err
                            });

                    }
                });
            }
        })
        .catch();
});

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth fail'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_KEY, {});
                    return res.status(200).json({
                        message: 'Auth successful',
                        status: 200,
                        token: token,
                        id: user[0]._id,
                        type: user[0].type,
                        contact: user[0].contact_no,
                        email: user[0].email,
                        name: user[0].first_name + ' ' + user[0].last_name
                    });
                }
                res.status(401).json({
                    message: 'Auth failed'
                });
            })
        })
        .catch(err => {
            error: err
        });
});

router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            })
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

//update service
router.patch('/updatepush/:userId', (req, res, next) => {
    const userId = req.params.userId;
    const pushId = req.body.push;

    User.update({ _id: userId }, { $set: { push: pushId } })
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

//find and return push id
router.get('/userpush/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .select('push')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    push: doc.push
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
router.patch('/comments/:userId', (req, res, next) => {
    const id = req.params.userId;
    const comment = req.body.comment;
    const username = req.body.user;
    const stars = req.body.stars;

    User.findByIdAndUpdate(
        id,
        { $push: { comments: { message: comment, name: username, stars: stars } } },
        { safe: true, upsert: true }
    ).exec()
        .then(result => {
            res.status(200).json({
                message: "Comment added"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;