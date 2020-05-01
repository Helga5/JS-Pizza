const templates = require("../Templates");
const storage = require("../storage");

var $cart = $("#ct-container");
var $items_count = $("#ct-count");
var $total_price = $("#ct-summ");

var Cart;

function initializeCart() {
    Cart = storage.get("cart");

    var totalPrice = 0;
    Cart.forEach(function(item) {
        totalPrice += item.quantity * item.pizza[item.size.field].price;
        var htmlCode = templates.OrderCart_OneItem(item); // Делаем html из ejs
        var $node = $(htmlCode);
        $cart.append($node);
    });

    $total_price.text(totalPrice);
    $items_count.text(Cart.length);
    $("#edit").click(function() {
        window.location.href = "/";
    });
}

function getPizzaInCart() {
    return Cart;
}

exports.initializeCart = initializeCart;
exports.getPizzaInCart = getPizzaInCart;
