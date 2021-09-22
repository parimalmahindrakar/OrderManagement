from flask import Flask, render_template, request, jsonify
import json, datetime

import pymysql

conn = pymysql.connect(
    host = "localhost", 
    database="practice",
    user= "root",
    password=""    
)
cursor = conn.cursor()

customers = {}
orders = {}
orderitems = {}
custnorders = {
    "customers" : customers,
    "orders" : orders,
    "ordersitems" : orderitems
}


def selectall():
    cursor.execute("select * from Customer")
    data = cursor.fetchall()
    for i in data:
        customers.update({i[0] : i[1:]})
    cursor.execute("select orderid, quantity, OrderItemName, orderedOn, status, name from Customer, OrderItem, Orders where Customer.custid=Orders.custid and Orders.orderitemid = OrderItem.orderitemID")
    data = cursor.fetchall()
    for i in data:
        orders.update({i[0] : i[1:]})
    custnorders.update({"ordersize" : len(orders)})
    cursor.execute(' select count(*) from Orders where status="Pending"')
    data = cursor.fetchall()[0][0]
    custnorders.update({"pending" : data})
    custnorders.update({"nonpending" : len(orders) - data })
    cursor.execute('select * from OrderItem')
    data = cursor.fetchall()
    for i in data:
        orderitems.update({i[0] : i[1:]})




app = Flask(__name__)

@app.route("/")
def home():
    selectall()
    # print(custnorders)
    return render_template("index.html",data = custnorders)

@app.route("/addcust",  methods =["GET", "POST"])
def addcustomer():
    if request.method == "POST":
        data = json.loads(request.data)
        name = data['name']
        gender = "F" if(data['gender'] == "Female") else "M"
        phone = data['phone']
        address = data['address']
        query = f'insert into Customer(name, gender, phone, address) values("{name}", "{gender}","{phone}", "{address}");'
        cursor.execute(query)
        conn.commit()
        print(data)
        return jsonify(data)
    return "FORBIDDEN"

@app.route("/addorder",  methods =["GET", "POST"])
def addorder():
    if request.method == "POST":
        data = json.loads(request.data)
        custid = data['custid']
        orderitemid = data['orderitemid']
        qtyorderitem = data['qtyorderitem']
        info = checkqty(qtyorderitem, orderitemid)
        print(info)
        if(info[0] > 0):
            d = datetime.datetime.now()
            print(int(qtyorderitem)*info[1])
            datenew = str(d.year)+"-"+str(d.month)+"-"+str(d.day)
            query = f'insert into Orders(quantity, custid, orderitemid, orderedOn, amount) values({qtyorderitem}, {custid}, {orderitemid},"{datenew}", {int(qtyorderitem)*info[1]})'
            cursor.execute(query)
            conn.commit()
            print("updated stock ",info)
            query = f'update OrderItem set stock = {info[0]} where orderitemID = {orderitemid}'
            cursor.execute(query)
            conn.commit()
            return jsonify({"msg" : "QE"}) # query executed
        return jsonify({"msg" : "SE"}) # stock exceeded
    return "FORBIDDEN"
        

def checkqty(qty,item):
    cursor.execute(f"select stock, price from OrderItem where orderitemID = {item}")
    data = cursor.fetchall()
    return [(int(data[0][0]) - int(qty)), int(data[0][1]) ]
    # return True if int(qty) < int(data) else False


@app.route('/searchcust',  methods =["GET", "POST"])
def searchcustomer():
    if request.method == "POST":
        data = json.loads(request.data)['words']
        cursor.execute(f"select * from Customer where name  like '%{data}%'")
        data = cursor.fetchall()
        return jsonify({"msg" : data})

@app.route('/searchorder',  methods =["GET", "POST"])
def searchorder():
    if request.method == "POST":
        data = json.loads(request.data)['words']
        cursor.execute(f"select orderid, quantity, OrderItemName, orderedOn, status, name from Customer, OrderItem, Orders where Customer.custid=Orders.custid and Orders.orderitemid = OrderItem.orderitemID and name like '%{data}%'")
        data = list(cursor.fetchall())
        
        for i in data:
            i =  list(i)
            # i[3] = str(i[3].year)+"-"+str(i[3].month)+"-"+str(i[3].day)
        print(data)
        return jsonify({"msg" : data})




@app.route("/getpendingntotal", methods =["GET", "POST"])
def getpending():
    if request.method == "POST":
        data =  json.loads(request.data)['whatwewant']
        query = ""
        if data == "Pending" or data == "Completed" : 
            query = f'select orderid, quantity, OrderItemName, orderedOn, status, name from Customer, OrderItem, Orders where Customer.custid=Orders.custid and Orders.orderitemid = OrderItem.orderitemID and status = "{data}";'
        else :
            query = f'select orderid, quantity, OrderItemName, orderedOn, status, name from Customer, OrderItem, Orders where Customer.custid=Orders.custid and Orders.orderitemid = OrderItem.orderitemID;'

        cursor.execute(query)
        data = cursor.fetchall()
        return jsonify({"msg" : data})


@app.route("/orderbyname", methods =["GET", "POST"])
def orderbyname():
    if request.method == "POST":
        data =  json.loads(request.data)
        query = ""
        if(data['words'] == 'orderbyname'):
            query = "select * from Customer order by name"
        elif(data['words'] == 'orderbyinitially'):
            query = "select * from Customer"
        cursor.execute(query)
        data = cursor.fetchall()
        return jsonify({"msg" : data})


@app.route("/orderbydate",  methods =["GET", "POST"])
def orderbydate():
    if request.method == "POST":
        data =  json.loads(request.data)
        query = ""
        if(data['words'] == "orderbydate"):
            query = "select orderid, quantity, OrderItemName, orderedOn, status, name from Customer, OrderItem, Orders where Customer.custid=Orders.custid and Orders.orderitemid = OrderItem.orderitemID order by orderedOn"
        elif(data['words'] == 'orderbyinitially'):
            query = "select orderid, quantity, OrderItemName, orderedOn, status, name from Customer, OrderItem, Orders where Customer.custid=Orders.custid and Orders.orderitemid = OrderItem.orderitemID"
        elif(data['words'] == 'orderbynameinorderstable'):
            query = "select orderid, quantity, OrderItemName, orderedOn, status, name from Customer, OrderItem, Orders where Customer.custid=Orders.custid and Orders.orderitemid = OrderItem.orderitemID order by name"
        cursor.execute(query)
        data = cursor.fetchall()
        return jsonify({"msg" : data})


'''

    create table Customer (
        custid int primary key auto_increment,
        name varchar(50) not null,
        gender varchar(1) not null,
        phone varchar(10) not null,
        address varchar(100) not null default "Pune"
    );

    create table OrderItem (
        orderitemID int primary key auto_increment, 
        OrderItemName varchar(50), 
        stock int check (stock > 0)  ,
        price int
    );

    create table Orders(     
        orderid int primary key auto_increment,      
        quantity int,      
        custid int,      
        orderitemid int,
        status varchar(30) default "Pending",     
        orderedOn date,   
        amount int,  
        foreign key(custid) references Customer(custid),
        foreign key(orderitemid) references OrderItem(orderitemID)
    );

    insert into OrderItem(OrderItemName, stock, price) values
    ("Samsung TV", 300, 40000),
    ("Samsung G M30S", 780, 14500),
    ("Realme 5G", 400, 19500),
    ("Lenovo Ideapad 330", 170, 42040),
    ("Xiomi TV", 900,25000);

'''