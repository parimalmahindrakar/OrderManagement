$("a#addcust").click(() => {
    $("div.add__cutsomer").css("display", "block")
})
$("i.fa").click(() => {
    $("div.add__cutsomer").css("display", "none")
})

$("a#addorder").click(() => {
    $("div.add__order").css("display", "block")
})
$("i.fa").click(() => {
    $("div.add__order").css("display", "none")
})


$("input#addcustbutton").click(() => {
    var name = $("input#flname")
    var phone = $("input#phonenum")
    var address = $("input#address")

    var url = "/addcust"
    // fetch(url, )

})




