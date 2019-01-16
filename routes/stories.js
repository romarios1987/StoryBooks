const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');


// User Model
const Story = require('../models/Story');


// Stories Index
router.get('/', (req, res) => {
    Story.find({status: 'public'})
        // find all the fields from user collection
        .populate('user')
        .then(stories => {

            res.render('stories/index', {stories:stories});
        });

});


// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
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

module.exports = router;