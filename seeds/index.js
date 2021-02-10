const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

//DATABASE CONNECTION
mongoose.connect('mongodb://localhost:27017/camprr', {
	useNewUrlParser    : true,
	useCreateIndex     : true,
	useUnifiedTopology : true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 200; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			author      : '601dd8e5bbea22507430661e',
			location    : `${cities[random1000].city}, ${cities[random1000].state}`,
			title       : `${sample(descriptors)} ${sample(places)}`,
			description :
				'Mauris sed bibendum mi. Ut et porta risus. Nunc ligula mi, tincidunt interdum nibh quis, elementum sagittis mauris. Mauris accumsan tincidunt diam, eget porttitor velit imperdiet in. Praesent iaculis interdum tortor. Etiam id dui diam. Ut nibh lorem, pharetra in commodo rutrum, lobortis non nibh. In auctor risus justo, vel fringilla dui porta eu. ',
			price,
			geometry    : {
				type        : 'Point',
				coordinates : [
					cities[random1000].longitude,
					cities[random1000].latitude
				]
			},
			images      : [
				{
					url      :
						'https://res.cloudinary.com/ddqrzmcmz/image/upload/v1612829183/camprr/vmrkmhd7hzf93hcq98nf.jpg',
					filename : 'camprr/vmrkmhd7hzf93hcq98nf'
				},
				{
					url      :
						'https://res.cloudinary.com/ddqrzmcmz/image/upload/v1612829186/camprr/wkwbxavkxlkyoi5afmvy.jpg',
					filename : 'camprr/wkwbxavkxlkyoi5afmvy'
				}
			]
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
