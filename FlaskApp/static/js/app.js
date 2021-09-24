$("a#addcust").click(() => {
    $("div#add__customer__add").css("display", "block")
})
$("i.fa").click(() => {
    $("div#add__customer__add").css("display", "none")
    
})
$("i.fa").click(() => {
    $("div#update__customer__update").css("display", "none")
    
})


$("i.fa").click(() => {
    location.reload()
    
})

$("a#addorder").click(() => {
    $("div.add__order").css("display", "block")
})
$("i.fa").click(() => {
    $("div.add__order").css("display", "none")
})




$("input#addcustbutton").click(() => {

    var name = $("input#flname").val()
    var phone = $("input#phonenum").val()
    var address = $("input#address").val()
    var gender = $("select#genders").val()
    
    var url = "/addcust"
    fetch(url, {
        method: "POST",
        body: JSON.stringify({
            'name': name,
            'phone': phone,
            'address': address,
            'gender': gender,
            'action' : 'add'
        })
    }).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data)
        window.location.reload()
    })

})

$("input#addorderbutton").click(() => {

    var custid = $("select#custselect").val()
    var orderitemid = $("select#orderitemselect").val()
    var qtyorderitem = $("input#qtyorderitem").val()

    var url = "/addorder"
    fetch(url, {
        method: "POST",
        body: JSON.stringify({
            'custid': custid,
            'orderitemid': orderitemid,
            'qtyorderitem' : qtyorderitem
        })
    }).then(res => res.json()).then((data) => {
        if (data.msg == "SE") {
            alert("Stock Exceeded or Stock Over")
        } else {
            window.location.reload()
        }
        
    })
})


$("input#searchcust").keyup(() => {
    var words = $("input#searchcust").val()
    if (words.length > 0) {
        fetch('/searchcust', {
            method: 'POST',
            body: JSON.stringify({
                'words' :words
            })
        }).then((res) => {
            return res.json()
        }).then((data) => {
    
            $("div.all__customers").empty()
           
    
            for (var i = 0; i < data.msg.length; i++) {
                var id = data.msg[i][0]
                var name = data.msg[i][1]
                var gender = data.msg[i][2]
                var phone = data.msg[i][3]
                var address = data.msg[i][4]
    
                console.log(id, " ", name, " ", phone, " ", address)
                
                str = '<div class="customers__infos">\
                    <div><p>'+id+'</p></div>\
                    <div><p custid='+id+' class="namewithgender" >'+name+' ('+gender+') </p></div>\
                    <div><p>'+phone+'</p></div>\
                    <div><p>'+address+'</p></div>\
                </div>'
                $("div.all__customers").append(str)
                // updatingonly()
            }
    
    
        })
    } else if(words.length == 0){
        location.reload()
    }
    
})


$("input#searchorderid").keyup(() => {
    var words = $("input#searchorderid").val()
    if (words.length > 2) {
        
        fetch("/searchorder", {
            method: "POST",
            body: JSON.stringify({
                'words' :words
            })
        }).then(res => res.json()).then((data) => {

            
            $("div.all__orders").empty()
            
            for (var i = 0; i < data.msg.length; i++) {
                orderid = data.msg[i][0]
                orderqty = data.msg[i][1]
                ordername = data.msg[i][2]
                date = data.msg[i][3]
                status = data.msg[i][4]
                orderedby = data.msg[i][5]


                str = '<div class="orders__infos">\
                    <div><p>'+ orderid +'</p></div>\
                    <div><p>'+ordername+' - ('+orderqty+') </p></div>\
                    <div><p> '+date+' </p></div>\
                    <div><p class="updatependingorder">'+status+'</p></div>\
                    <div><p>'+orderedby+'</p></div>\
                </div>'

                $("div.all__orders").append(str)

            }


        })


    } else if(words.length == 0){
        location.reload()
    }
})



$("div#pendingid").click(() => {

    fetch("/getpendingntotal", {
        method: "POST",
        body: JSON.stringify({
            'whatwewant' : "Pending"
        })
    }).then(res => res.json()).then((data) => {

        

        $("div.all__orders").empty()

        console.log(data.msg.length)
            
        for (var i = 0; i < data.msg.length; i++) {
                

                orderid = data.msg[i][0]
                orderqty = data.msg[i][1]
                ordername = data.msg[i][2]
                date = data.msg[i][3]
                status = data.msg[i][4]
                orderedby = data.msg[i][5]



                str = '<div class="orders__infos">\
                    <div><p>'+ orderid +'</p></div>\
                    <div><p>'+ordername+' - ('+orderqty+') </p></div>\
                    <div><p> '+date+' </p></div>\
                    <div><p class="updatependingorder">'+status+'</p></div>\
                    <div><p>'+orderedby+'</p></div>\
                </div>'

                $("div.all__orders").append(str)

            }
    })
})

$("div#totalid").click(() => {
    fetch("/getpendingntotal", {
        method: "POST",
        body: JSON.stringify({
            'whatwewant' : "all"
        })
    }).then(res => res.json()).then((data) => {

        

        $("div.all__orders").empty()

        console.log(data.msg.length)
            
        for (var i = 0; i < data.msg.length; i++) {
                

                orderid = data.msg[i][0]
                orderqty = data.msg[i][1]
                ordername = data.msg[i][2]
                date = data.msg[i][3]
                status = data.msg[i][4]
                orderedby = data.msg[i][5]



                str = '<div class="orders__infos">\
                    <div><p>'+ orderid +'</p></div>\
                    <div><p>'+ordername+' - ('+orderqty+') </p></div>\
                    <div><p> '+date+' </p></div>\
                    <div><p class="updatependingorder">'+status+'</p></div>\
                    <div><p>'+orderedby+'</p></div>\
                </div>'

                $("div.all__orders").append(str)

            }
    })
})

$("div#completedid").click(() => {
    fetch("/getpendingntotal", {
        method: "POST",
        body: JSON.stringify({
            'whatwewant' : "Completed"
        })
    }).then(res => res.json()).then((data) => {

        

        $("div.all__orders").empty()

        console.log(data.msg.length)
            
        for (var i = 0; i < data.msg.length; i++) {
                

                orderid = data.msg[i][0]
                orderqty = data.msg[i][1]
                ordername = data.msg[i][2]
                date = data.msg[i][3]
                status = data.msg[i][4]
                orderedby = data.msg[i][5]



                str = '<div class="orders__infos">\
                    <div><p>'+ orderid +'</p></div>\
                    <div><p>'+ordername+' - ('+orderqty+') </p></div>\
                    <div><p> '+date+' </p></div>\
                    <div><p class="updatependingorder">'+status+'</p></div>\
                    <div><p>'+orderedby+'</p></div>\
                </div>'

                $("div.all__orders").append(str)

        }
    })
})



$("i#orderbyname").click(() => {
    fetch("/orderbyname", {
        method: "POST",
        body: JSON.stringify({
            "words" : "orderbyname"
        })
    }).then(res => res.json()).then((data) => {
        $("div.all__customers").empty()
        $("i#orderbyname").attr("class", "fas fa-caret-up")
        for (var i = 0; i < data.msg.length; i++)  {
            str = '<div class="customers__infos">\
                <div><p>'+data.msg[i][0]+'</p></div>\
                <div><p custid='+data.msg[i][0]+' class="namewithgender">'+data.msg[i][1]+'('+data.msg[i][2]+') </p></div>\
                <div><p>'+data.msg[i][3]+'</p></div>\
                <div><p>'+data.msg[i][4]+'</p></div>\
            </div>'
            $("div.all__customers").append(str)
        }
    })
})

$("i#orderinitially").click(() => {
    
    location.reload()

})


$("i#orderbydate").click(() => {
    
    fetch("/orderbydate", {
        method: "POST",
        body: JSON.stringify({
            "words" : "orderbydate"
        })
    }).then(res => res.json()).then((data) => {
        

        $("div.all__orders").empty()
        $("i#orderbydate").attr("class", "fas fa-caret-up")


        $("i#orderbyinitially").attr("class", "fas fa-caret-down")
        $("i#orderbynameinorderstable").attr("class", "fas fa-caret-down")
            
        for (var i = 0; i < data.msg.length; i++) {
                

                orderid = data.msg[i][0]
                orderqty = data.msg[i][1]
                ordername = data.msg[i][2]
                date = data.msg[i][3]
                status = data.msg[i][4]
                orderedby = data.msg[i][5]



                str = '<div class="orders__infos">\
                    <div><p>'+ orderid +'</p></div>\
                    <div><p>'+ordername+' - ('+orderqty+') </p></div>\
                    <div><p> '+date+' </p></div>\
                    <div><p class="updatependingorder">'+status+'</p></div>\
                    <div><p>'+orderedby+'</p></div>\
                </div>'

                $("div.all__orders").append(str)

        }


    })

})



$("i#orderbyinitially").click(() => {
    
    location.reload()

})





$("i#orderbynameinorderstable").click(() => {
    
    fetch("/orderbydate", {
        method: "POST",
        body: JSON.stringify({
            "words" : "orderbynameinorderstable"
        })
    }).then(res => res.json()).then((data) => {
        

        $("div.all__orders").empty()
        $("i#orderbynameinorderstable").attr("class", "fas fa-caret-up")
        $("i#orderbyinitially").attr("class", "fas fa-caret-down")
        $("i#orderbydate").attr("class", "fas fa-caret-down")


            
        for (var i = 0; i < data.msg.length; i++) {
                

                orderid = data.msg[i][0]
                orderqty = data.msg[i][1]
                ordername = data.msg[i][2]
                date = data.msg[i][3]
                status = data.msg[i][4]
                orderedby = data.msg[i][5]



                str = '<div class="orders__infos">\
                    <div><p>'+ orderid +'</p></div>\
                    <div><p>'+ordername+' - ('+orderqty+') </p></div>\
                    <div><p> '+date+' </p></div>\
                    <div><p class="updatependingorder">'+status+'</p></div>\
                    <div><p>'+orderedby+'</p></div>\
                </div>'

                $("div.all__orders").append(str)

        }


    })

})







var updateBtns = document.getElementsByClassName("namewithgender");
for (var i = 0; i < updateBtns.length; i++) {

    updateBtns[i].addEventListener('click', function () {

        var custid = this.getAttribute("custid")
        fetch("/getcustbyid", {
            method: "POST",
            body: JSON.stringify({
                'id':custid
            })
        }).then(res => res.json()).then((data) => {

            $("div#update__customer__update").css("display", "block")
            $("input#flnameupdate").attr("value", data.msg[0][1])
            $("input#phonenumupdate").attr("value", data.msg[0][3])
            $("select#gendersupdate").val(data.msg[0][2] == "M" ? "Male" : "Female")
            $("input#addressupdate").attr("value", data.msg[0][4])

            $("input#addcustbuttonupdate").click(() => {
                var flname = $("input#flnameupdate").val()
                var phonenum = $("input#phonenumupdate").val()
                var gender = $("select#gendersupdate").val()
                var address = $("input#addressupdate").val()
                console.log(flname, phonenum, gender, address)
                
                var url = "/addcust"
                fetch(url, {
                    method: "POST",
                    body: JSON.stringify({
                        'name': flname,
                        'phone': phonenum,
                        'address': address,
                        'gender': gender,
                        'action': 'update',
                        'custid': custid
                    })
                }).then((res) => {
                    return res.json()
                }).then((data) => {
                    console.log(data)
                    window.location.reload()
                })


            })

        })
        
    })
}





var updateOrdersBtns = document.getElementsByClassName("updatependingorder");
for (var i = 0; i < updateOrdersBtns.length; i++) {

    updateOrdersBtns[i].addEventListener('click', function () {

        $("div#pendingtocomplted").css("display", "block")



        var orderid = this.getAttribute("orderid")

        $("button#surecompletedid").click(() => {
            fetch("/updatependingorder", {
                method: "POST",
                body: JSON.stringify({
                    "orderid" : orderid
                })
            }).then(res => res.json()).then((data) => {
                location.reload()
            }) 
        })
        
        

     })
}



