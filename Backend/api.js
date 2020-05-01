var list = require("./data/PizzaList");

exports.getPizzaList = function(req, res) {
	res.send(list);
};

exports.createOrder = function(req, res) {
	console.log("Order created: " + req.body.name);
	res.send(true); // Отправляем обратно на frontend
};
