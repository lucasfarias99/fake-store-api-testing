const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const myEnv = dotenv.config({ path: require('path').join(__dirname, '../.env') });
dotenvExpand.expand(myEnv);

const Product = require('../model/product');
const Cart = require('../model/cart');
const User = require('../model/user');

async function fetchJSON(url) {
	const res = await fetch(url);
	return res.json();
}

async function seed() {
	await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
	console.log('Connected to MongoDB');

	await Promise.all([
		Product.deleteMany({}),
		Cart.deleteMany({}),
		User.deleteMany({}),
	]);
	console.log('Cleared existing data');

	const [products, carts, users] = await Promise.all([
		fetchJSON('https://fakestoreapi.com/products'),
		fetchJSON('https://fakestoreapi.com/carts'),
		fetchJSON('https://fakestoreapi.com/users'),
	]);

	await Product.insertMany(products.map(({ rating, ...p }) => p));
	await Cart.insertMany(carts);
	await User.insertMany(users);

	console.log(`Seeded: ${products.length} products, ${carts.length} carts, ${users.length} users`);
	await mongoose.disconnect();
}

seed().catch((err) => {
	console.error(err);
	process.exit(1);
});
