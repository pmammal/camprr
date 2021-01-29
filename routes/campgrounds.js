const express = require('express');
const router = express.Router();
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');

router.get('/', async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });
});
//NEW CAMPGROUNDS FORM
router.get('/new', (req, res) => {
	res.render('campgrounds/new');
});
//POST NEW CAMPGROUND
router.post(
	'/',
	validateCampground,
	catchAsync(async (req, res) => {
		// if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
		const campground = new Campground(req.body.campground);
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	})
);
//SHOW CAMPGROUND
router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate('reviews');
		res.render('campgrounds/show', { campground });
	})
);
//EDIT CAMPGROUND FORM
router.get(
	'/:id/edit',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		res.render('campgrounds/edit', { campground });
	})
);
//UPDATE CAMPGROUND
router.put(
	'/:id',
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
		res.redirect(`/campgrounds/${campground._id}`);
	})
);
//DELETE
router.delete(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		res.redirect('/campgrounds');
	})
);

module.exports = router;
