from flask import Flask, render_template, request, jsonify
import json

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
custnorders = {
    "customers" : customers,
    "orders" : orders,
}


def selectall():
    cursor.execute("select * from Customer")
    data = cursor.fetchall()
    for i in data:
        customers.update({i[0] : i[1:]})
    cursor.execute("select orderid, ordername, quantity, name, orderedOn, status from Customer join Orders where Orders.custid = Customer.custid")
    data = cursor.fetchall()
    for i in data:
        orders.update({i[0] : i[1:]})
    custnorders.update({"ordersize" : len(orders)})
    cursor.execute(' select count(*) from Orders where status="Pending"')
    data = cursor.fetchall()[0][0]
    custnorders.update({"pending" : data})
    custnorders.update({"nonpending" : len(orders) - data })



app = Flask(__name__)

@app.route("/")
def home():
    selectall()
    return render_template("index.html",data = custnorders)

@app.route("/addcust",  methods =["GET", "POST"])
def addcustomer():
    if request.method == "POST":
        data = json.loads(request.data)
        print(data)
    return "FORBIDDEN"

