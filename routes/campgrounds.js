const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground');

//ALL
router.get('/', catchAsync(campgrounds.index));

//NEW CAMPGROUNDS FORM
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

//POST NEW CAMPGROUND
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

//SHOW CAMPGROUND
router.get('/:id', catchAsync(campgrounds.showCampground));

//EDIT CAMPGROUND FORM
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

//UPDATE CAMPGROUND
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

//DELETE
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
