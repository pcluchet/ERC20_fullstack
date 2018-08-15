var currentInvoiceJSON =
{
    "total": 0,
    "products":
        [

        ]
};

var bc = new BroadcastChannel('qrcode_channel');

function resetInvoice() {
    var list = document.getElementById("invoicelist");
    list.innerHTML = "";


    var grand = document.getElementById("grand");
    grand.innerHTML = "0";
    currentInvoiceJSON =
        {
            "total": 0,
            "products":
                [

                ]
        };

    console.log(JSON.stringify(currentInvoiceJSON));
}

function customer_interface()
{
    window.open("http://localhost/merchant_app/what_customer_see.php"); 
}


function dje() {
    var element = document.getElementById("selectedproduct");
    var price = element.options[element.selectedIndex].getAttribute('price');
    var name = element.options[element.selectedIndex].innerHTML;
    var value = element.options[element.selectedIndex].value;
    console.log("Amount = " + price + " name = " + name);

    var newproduct =
        '<li class="product">\
    <div class="productname">\
    <button>X</button> '+
        name + '</div>\
    <div class="productprice">'+
        price + '€\
    </div></li>';

    var newProductObj = { "Name": value, "Amount": parseInt(price) }



    var list = document.getElementById("invoicelist");
    list.innerHTML += newproduct;


    var grand = document.getElementById("grand");
    grand.innerHTML = parseInt(grand.innerHTML) + parseInt(price);
    currentInvoiceJSON.total = parseInt(grand.innerHTML);
    currentInvoiceJSON.products.push(newProductObj);

    //bc.postMessage(currentInvoiceJSON);
    var ffo = document.getElementById("postdata");
    ffo.value = encodeURIComponent(JSON.stringify(currentInvoiceJSON));

    console.log(JSON.stringify(currentInvoiceJSON));
}