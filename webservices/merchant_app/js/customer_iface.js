function main()
{

    console.log("here");

    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: "void",
        width: 400,
        height: 400,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    var bc = new BroadcastChannel('qrcode_channel');
    bc.onmessage = function (ev) {
        console.log(ev.data); 

        var data = JSON.parse(ev.data);
        var qrstr = '{"id" : "'+ data.billid + '", "t" : "'+data.total+'"}';
        qrcode.makeCode(qrstr); 

        var billid = document.getElementById("billid");
        billid.innerHTML = data.billid;


        var total = document.getElementById("totalamount");
        total.innerHTML = data.total;
    } /* receive */
}