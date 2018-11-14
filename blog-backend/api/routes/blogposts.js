const express = require('express');
const router = express.Router();
const Blogpost = require('../models/blogpost');
const mongoose = require('mongoose');

//Control for get all blog posts
router.get('/', (req, res, next) => {
    Blogpost.find()
        .select('author title content _id')
        .populate('author')
        .exec()
        .then(docs => {
            const response ={
                count : docs.length,
                blogs:docs.map(doc =>{
                    return{
                        id:doc._id,
                        title:doc.title,
                        content:doc.content,
                        request:{
                            type: 'GET',
                            url :`http://localhost:3000/blogposts/${doc._id}`
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

//Control for get blog post by ID
router.get('/:blogpostId', (req, res, next) => {

    const id = req.params.blogpostId;
    Blogpost.findById(id)
        .select('title content _id')
        .exec()
        .then(doc => {
            // console.log(doc);
            if (doc) {
                res.status(200).json({
                    blogpost:doc,
                    request:{
                        type: 'GET',
                        url :`http://localhost:3000/blogposts`
                    }
                });
            }
            else {
                res.status(404).json({
                    message: 'No Valid Entry found'
                })
            }
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json(
                {
                    error: err
                }
            );
        });
});

//Controller for update blogPost
router.patch('/:blogPostId', (req, res, next) => {
    const id = req.params.blogPostId;
    //This allows to just update one thing, instead of the whole
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Blogpost.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                Blogpost.updateOne({ _id: id }, { $set: updateOps })
                    .select('title content _id')
                    .exec((err, response) => {
                        if (err) {
                            res.status(500).json({
                                error: err
                            })
                        }
                        res.status(200).json({
                            title :response.title,
                            content:response.content,
                            id:response._id,
                            message: 'Blog is Updated',
                            request:{
                                type: 'GET',
                                url :`http://localhost:3000/blogposts/${doc._id}`
                            }
                        })
                    })
                // .then(res=>{
                //     res.status(200).json(res)
                // })
                // .catch(err =>{
                //     res.status(500).json({
                //         error:err
                //     })
                // })
            }
            else {
                res.status(404).json({
                    message: 'Post not found'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

//Control for delete blog post
router.delete('/:blogPostId', (req, res, next) => {
    const id = req.params.blogPostId;
    Blogpost.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                Blogpost.remove({
                    _id: id
                })
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message:'Product deleted',
                            request:{
                                type: 'POST',
                                url :`http://localhost:3000/blogposts/`,
                                body:{title: 'String', content:'String'}
                            }
                        
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
            }
            else
                res.status(404).json({
                    message: `BlogPost not found`
                })
        }
        )
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});
//Controller for create a  blog post
router.post('/', (req, res, next) => {
    const newBlogPost = new Blogpost(
        {
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            content: req.body.content
        });
    newBlogPost.save()
        .then(result => {
            const createdBlogPost={
                _id: result._id,
                title: result.title,
                content:result.content,
                request:{
                    type: 'GET',
                    url :`http://localhost:3000/blogposts/${result._id}`
                }
            }
            res.status(200).json(createdBlogPost);
        }) //For a callback promise
        .catch(err => {
            res.status(500).json({
                error:err
            });
        })
});

module.exports = router;