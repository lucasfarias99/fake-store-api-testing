const Cart = require('../model/cart');

module.exports.getAllCarts = (req, res) => {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;
	const startDate = req.query.startdate || new Date('1970-1-1');
	const endDate = req.query.enddate || new Date();

	Cart.find({ date: { $gte: new Date(startDate), $lt: new Date(endDate) } })
		.select('-_id -products._id')
		.limit(limit)
		.sort({ id: sort })
		.then((carts) => res.json(carts))
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};

module.exports.getCartsbyUserid = (req, res) => {
	const startDate = req.query.startdate || new Date('1970-1-1');
	const endDate = req.query.enddate || new Date();

	Cart.find({
		userId: req.params.userid,
		date: { $gte: new Date(startDate), $lt: new Date(endDate) },
	})
		.select('-_id -products._id')
		.then((carts) => res.json(carts))
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};

module.exports.getSingleCart = (req, res) => {
	Cart.findOne({ id: req.params.id })
		.select('-_id -products._id')
		.then((cart) => res.json(cart))
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};

module.exports.addCart = (req, res) => {
	Cart.find()
		.countDocuments()
		.then((count) => {
			const cart = new Cart({
				id: count + 1,
				userId: req.body.userId,
				date: req.body.date,
				products: req.body.products,
			});
			return cart.save();
		})
		.then((cart) => {
			const { _id, __v, ...data } = cart.toObject();
			res.json(data);
		})
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};

module.exports.editCart = (req, res) => {
	Cart.findOneAndUpdate(
		{ id: parseInt(req.params.id) },
		{
			userId: req.body.userId,
			date: req.body.date,
			products: req.body.products,
		},
		{ new: true }
	)
		.select('-_id -products._id')
		.then((cart) => res.json(cart))
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};

module.exports.deleteCart = (req, res) => {
	Cart.findOneAndDelete({ id: req.params.id })
		.select('-_id -products._id')
		.then((cart) => res.json(cart))
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};
