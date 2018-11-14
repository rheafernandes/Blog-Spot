const express = require('express');
const router = express.Router();
const mongoose= require('mongoose');
const User =require('../models/user');

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
    .select('blogpost _id name email password location description')
    .populate('blogpost')
    .exec()
    .then(doc => {
        if(doc)
        res.status(200).json(doc)
        else
        res.status(404).json({
            message: "No user found"
        })
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        })
    })
});

router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    User.findById(id)
    .exec()
    .then(doc => {
        if(doc){
            User.updateOne({_id:id},{$set: updateOps})
            .exec((err,response)=>{
                if(err){
                    res.status(500).json({
                    error: err
                    })
                }
                res.status(200).json(response)
            })
        }
        else{
            res.status(404).json({
                message: 'User not found'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    })
});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
    .exec()
    .then(doc => {
        if (doc) {
            User.remove({
                _id: id
            })
                .exec()
                .then(result => {
                    res.status(200).json(result);
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        }
        else
            res.status(404).json({
                message: `User not found`
            })
    }
    )
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })

});

router.post('/', (req, res, next) => {
    const newUser = new User(
        {
            _id: new mongoose.Types.ObjectId(),
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            location:req.body.location,
            description:req.body.description
        }
    )
    newUser.save()
    .then(result => {
        res.status(200).json(result);
    }) //For a callback promise
    .catch(err => {
        res.status(500).json({
            error:err
        });
    })
});

module.exports = router;