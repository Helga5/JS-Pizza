const PIZZA_LIST = require("./data/PizzaList");
const CRYPTO = require("crypto");

const LIQPAY_PUBLIC_KEY = "i28349463001";
const LIQPAY_PRIVATE_KEY = "FNvgzuywNEXHT6fHgbisMLmpEdVN44AzMVZfGTKt";

exports.getPizzaList = (req, res) => {
    res.send(PIZZA_LIST);
};

function sha1(string) {
    var sha1 = CRYPTO.createHash("sha1");
    sha1.update(string);
    return sha1.digest("base64");
}

function totalPrice(cart) {
    let price = 0;
    cart.forEach(item => price += item.quantity * item.pizza[item.size.field].price);
    return price;
}

function orderDescription(name, phone, address, cart, price) {
    let description = "";
    description += "Замовлення піци: " + name + "\n";
    description += "Адреса доставки: " + address + "\n";
    description += "Телефон: " + phone + "\n";
    description += "Замовлення:\n";
    cart.forEach(item => {
        description += "- " + item.quantity + "шт. [" + item.size.string + "] " + item.pizza.title + ";\n";
    });
    description += "\nРазом " + price + " грн.";
    return description;
}

exports.createOrder = (req, res) => {
    var orderInfo = req.body;
    let price = totalPrice(orderInfo.cart);
    let order = {
        version: 3,
        public_key: LIQPAY_PUBLIC_KEY,
        action: "pay",
        amount: price,
        currency: "UAH",
        description: orderDescription(
            orderInfo.customerData.name,
            orderInfo.customerData.phone,
            orderInfo.customerData.address,
            orderInfo.cart,
            price
        ),
        order_id: Math.random(),
        sandbox: 1
    };

    let order_base64 = new Buffer(JSON.stringify(order)).toString("base64");
    let result = JSON.stringify({
        data: order_base64,
        signature: sha1(LIQPAY_PRIVATE_KEY + order_base64 + LIQPAY_PRIVATE_KEY)
    });
    res.send(result);
};
