let orders = document.getElementById("orders")

async function getAllOrders(status) {
  orders.innerHTML = ""
  await firebase.database().ref("AllOrders").get()
    .then((snap) => {
      let data = Object.values(snap.val());

      for (let index = 0; index < data.length; index++) {
        if (data[index]["status"] == status || status == "all") {

          data[index]["status"] == "pending" ?
            orders.innerHTML += `
            <div class="col col-lg-4 col-md-6 col-sm-12">
            <div class="card">
            <div class="card-body">
              <h5 class="card-title" id = ${data[index]["userId"]}>${data[index]["UserName"]}</h5>
              <p class="card-text mt-4"><b>Total Amount </b> : ${data[index]["toal_amount"]}</p>
              <p class="card-text"><b>No Of Dishes </b> : ${data[index]["Dishes"].length}</p>
              <a class="btn btn-danger" id = ${data[index]["OrderKey"]} onclick = "order_Status_Update(this)">Reject</a>
              <a class="btn btn-primary"  id = ${data[index]["OrderKey"]} onclick = 'viewOrderDetails(this)'>View Orders</a>
              <a class="btn btn-success" id = ${data[index]["OrderKey"]} onclick = "order_Status_Update(this)">Accept</a>
            </div>
          </div>
          </div>
       `

            :
            orders.innerHTML += `
       <div class="col col-lg-4 col-md-6 col-sm-12">
       <div class="card">
       <div class="card-body">
         <h5 class="card-title" id = ${data[index]["userId"]}>${data[index]["UserName"]}</h5>
         <p class="card-text mt-4"><b>Total Amount </b> : ${data[index]["toal_amount"]}</p>
         <p class="card-text"><b>No Of Dishes </b> : ${data[index]["Dishes"].length}</p>
         <a class="btn btn-primary" id = ${data[index]["OrderKey"]} onclick = 'viewOrderDetails(this)'>View Orders</a>
       </div>
     </div>
     </div>
  `
        }


      }
    })
}


getAllOrders("all")


async function order_Status_Update(e) {

  let orderKey = e.id
  let userID = e.parentNode.childNodes[1].id
  let orderStatus = e.innerText.toLowerCase()


  var price = e.parentNode.childNodes[3].innerText.split(":")
  var newprice = price[1].replace(" ", "")


  // admin side updated
  await firebase.database().ref("AllOrders").child(orderKey).update({
    "status": orderStatus
  })

  // user side update
  await firebase.database().ref("UsersOrders").child(userID).child(orderKey).update({
    "status": orderStatus
  })

  getAllOrders("all")

  await firebase.database().ref("AllOrders").child(orderKey).get()
    .then(async (snap) => {
      if (orderStatus == "accept") {
        await firebase.database().ref("Payments").child(orderKey).update({
          "payment": newprice,
          "order ": snap.val()
        })

      }
    })
    .catch((e)=>{
      console.log(e);
    })

}



function viewOrderDetails(e) {
  localStorage.setItem("current_order_detail_key", e.id)
  window.location.href = "../order Details Page/index.html"
}


function logOut() {
  localStorage.clear()
  window.location.replace("../../index.html")
}

