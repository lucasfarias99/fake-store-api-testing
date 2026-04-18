const User = require('../model/user');

module.exports.getAllUser = (req, res) => {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	User.find()
		.select(['-_id'])
		.limit(limit)
		.sort({ id: sort })
		.then((users) => res.json(users))
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};

module.exports.getUser = (req, res) => {
	User.findOne({ id: req.params.id })
		.select(['-_id'])
		.then((user) => res.json(user))
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};

module.exports.addUser = (req, res) => {
	User.find()
		.countDocuments()
		.then((count) => {
			const user = new User({
				id: count + 1,
				email: req.body.email,
				username: req.body.username,
				password: req.body.password,
				name: {
					firstname: req.body.name.firstname,
					lastname: req.body.name.lastname,
				},
				address: {
					city: req.body.address.city,
					street: req.body.address.street,
					number: req.body.address.number,
					zipcode: req.body.address.zipcode,
					geolocation: {
						lat: req.body.address.geolocation.lat,
						long: req.body.address.geolocation.long,
					},
				},
				phone: req.body.phone,
			});
			return user.save();
		})
		.then((user) => {
			const { _id, __v, ...data } = user.toObject();
			res.json(data);
		})
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};

module.exports.editUser = (req, res) => {
	User.findOneAndUpdate(
		{ id: parseInt(req.params.id) },
		{
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
			name: {
				firstname: req.body.name.firstname,
				lastname: req.body.name.lastname,
			},
			address: {
				city: req.body.address.city,
				street: req.body.address.street,
				number: req.body.address.number,
				zipcode: req.body.address.zipcode,
				geolocation: {
					lat: req.body.address.geolocation.lat,
					long: req.body.address.geolocation.long,
				},
			},
			phone: req.body.phone,
		},
		{ new: true }
	)
		.select(['-_id'])
		.then((user) => res.json(user))
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};

module.exports.deleteUser = (req, res) => {
	User.findOneAndDelete({ id: req.params.id })
		.select(['-_id'])
		.then((user) => res.json(user))
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};
