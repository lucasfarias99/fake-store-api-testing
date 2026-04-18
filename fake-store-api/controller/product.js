const Product = require('../model/product');

module.exports.getAllProducts = (req, res) => {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	Product.find()
		.select(['-_id'])
		.limit(limit)
		.sort({ id: sort })
		.then((products) => res.json(products))
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};

module.exports.getProduct = (req, res) => {
	Product.findOne({ id: req.params.id })
		.select(['-_id'])
		.then((product) => res.json(product))
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};

module.exports.getProductCategories = (req, res) => {
	Product.distinct('category')
		.then((categories) => res.json(categories))
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};

module.exports.getProductsInCategory = (req, res) => {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	Product.find({ category: req.params.category })
		.select(['-_id'])
		.limit(limit)
		.sort({ id: sort })
		.then((products) => res.json(products))
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};

module.exports.addProduct = (req, res) => {
	Product.find()
		.countDocuments()
		.then((count) => {
			const product = new Product({
				id: count + 1,
				title: req.body.title,
				price: req.body.price,
				description: req.body.description,
				image: req.body.image,
				category: req.body.category,
			});
			return product.save();
		})
		.then((product) => {
			const { _id, __v, ...data } = product.toObject();
			res.json(data);
		})
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};

module.exports.editProduct = (req, res) => {
	Product.findOneAndUpdate(
		{ id: parseInt(req.params.id) },
		{
			title: req.body.title,
			price: req.body.price,
			description: req.body.description,
			image: req.body.image,
			category: req.body.category,
		},
		{ new: true }
	)
		.select(['-_id'])
		.then((product) => res.json(product))
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};

module.exports.deleteProduct = (req, res) => {
	Product.findOneAndDelete({ id: req.params.id })
		.select(['-_id'])
		.then((product) => res.json(product))
		.catch((err) => res.status(500).json({ status: 'error', message: err.message }));
};
