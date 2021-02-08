const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

//ALL
router.get('/', async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });
});
//NEW CAMPGROUNDS FORM
router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});
//POST NEW CAMPGROUND
router.post(
	'/',
	isLoggedIn,
	validateCampground,
	catchAsync(async (req, res) => {
		const campground = new Campground(req.body.campground);
		campground.author = req.user._id;
		await campground.save();
		req.flash('success', 'Successfully created campground!');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);
//SHOW CAMPGROUND
router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
		if (!campground) {
			req.flash('error', 'Cannot find that campground!');
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/show', { campground });
	})
);
//EDIT CAMPGROUND FORM
router.get(
	'/:id/edit',
	isLoggedIn,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		if (!campground) {
			req.flash('error', 'Cannot find that campground!');
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/edit', { campground });
	})
);
//UPDATE CAMPGROUND
router.put(
	'/:id',
	isLoggedIn,
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
		req.flash('success', 'Successfully updated campground!');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);
//DELETE
router.delete(
	'/:id',
	isLoggedIn,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		req.flash('success', 'Successfully deleted campground!');
		res.redirect('/campgrounds');
	})
);

module.exports = router;
