let orders = document.getElementById("orders")

async function getAllOrders(status) {
  orders.innerHTML = ""
  await firebase.database().ref("AllOrders").get()
    .then((snap) => {
      // console.log(Object.values(snap.val()));
      let data = Object.values(snap.val());
      // console.log(data);

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
              <a href="#" class="btn btn-danger" id = ${data[index]["OrderKey"]} onclick = "order_Status_Update(this)">Reject</a>
              <a href="#" class="btn btn-primary">View Orders</a>
              <a href="#" class="btn btn-success" id = ${data[index]["OrderKey"]} onclick = "order_Status_Update(this)">Accept</a>
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
         <a href="#" class="btn btn-primary">View Orders</a>
       </div>
     </div>
     </div>
  `
        }


      }

      // getAllOrders("all")

    })
}


getAllOrders("all")


async function order_Status_Update(e) {
  // console.log(e.parentNode.childNodes[1].id);
  let orderKey = e.id
  let userID = e.parentNode.childNodes[1].id 
  let orderStatus = e.innerText.toLowerCase()

  await firebase.database().ref("AllOrders").child(orderKey).update({
    "status": orderStatus
  })

  await firebase.database().ref("UsersOrsers").child(userID).child(orderKey).update({
    "status": orderStatus
  })

  getAllOrders("all")
}
