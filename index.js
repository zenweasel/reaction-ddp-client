var DDPClient = require("ddp");
var _ = require("lodash");

var ddpclient = new DDPClient({
    host: "localhost",
    port: 3000,
    ssl: false,
    autoReconnect: true,
    maintainCollections: true
});

ddpclient.connect(function (error, wasReconnect) {
    if (error) {
        console.log("DDP Connection error");
        return;
    }

    if (wasReconnect) {
        console.log("connection reestablished");
    }
    console.log("DDP connected");


    ddpclient.subscribe("Products", [], function () {
        console.log("Products fetched");
        var products = ddpclient.collections.Products;
        _.map(products, function (product) {
            console.log("==> " + product.title);
            console.log("==> " + product.price.range);
        });
        ddpclient.close();
    });

});

ddpclient.on("message", function (msg) {
    console.log("DDP message" + msg);
});

