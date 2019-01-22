const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');


// Story Model
const Story = require('../models/Story');


// Stories Index
router.get('/', (req, res) => {
    Story.find({status: 'public'})
        .populate('user')
        .sort({date: 'desc'})
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        });
});

// Show Single Story
router.get('/show/:id', (req, res) => {
    Story.findOne({_id: req.params.id})
        .populate('user')
        .populate('comments.commentUser')
        .then(story => {
            //res.render('stories/show', {story});

            if (story.status === 'public') {
                res.render('stories/show', {story: story});
            } else {
                // if user login
                if (req.user) {
                    if (req.user.id === story.user._id) {
                        res.render('stories/show', {story: story});
                    } else {
                        res.redirect('/stories');
                    }
                } else {
                    res.redirect('/stories');
                }
            }
        })

});

// List Stories From User
router.get('/user/:userId', (req, res) => {
    Story.find({
        user: req.params.userId,
        status: 'public'
    })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {stories})
        })
});

// Logged Users Story
router.get('/my/', ensureAuthenticated, (req, res) => {
    Story.find({
        user: req.user.id
    })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {stories})
        })
});


// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});


// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({_id: req.params.id})
    // .populate('user')
        .then(story => {
            if (story.user != req.user.id) {
                res.redirect('/stories')
            } else {
                res.render('stories/edit', {story: story});
            }

        });
});

// Process Add Story
router.post('/', (req, res) => {

    let allowComments;
    const {title, body, status} = req.body;


    if (req.body.allowComments) {
        allowComments = true
    } else {
        allowComments = false
    }

    const newStory = {
        title,
        body,
        status,
        allowComments: allowComments,
        user: req.user.id
    };

    // Create Story
    new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`/stories/show/${story.id}`)
        });
});


// Process Edit Story
router.put('/:id', (req, res) => {
    const {title, body, status,} = req.body;

    Story.findOne({_id: req.params.id})
        .then(story => {
            let allowComments;

            req.body.allowComments ? allowComments = true : allowComments = false;


            // new values
            story.title = title;
            story.body = body;
            story.status = status;
            story.allowComments = allowComments;

            story.save()
                .then(() => {
                    res.redirect('/dashboard');
                })
                .catch(err => console.log(err))
        })
    //res.send('PUT');
});


/**
 * Delete Story DELETE
 */

router.delete('/:id', ensureAuthenticated, (req, res) => {
    Story.remove({_id: req.params.id})
        .then(() => {
            res.redirect('/dashboard');
        })
});

/**
 * Add comment
 */


router.post('/comment/:id', (req, res) => {
    const {commentBody} = req.body;
    Story.findOne({_id: req.params.id})
        .then((story) => {
            const newComment = {
                commentBody,
                commentUser: req.user.id
            };

            // Add to comments array
            story.comments.unshift(newComment);

            story.save()
                .then(() => {
                    res.redirect(`/stories/show/${story.id}`);
                })
        })
});


module.exports = router;