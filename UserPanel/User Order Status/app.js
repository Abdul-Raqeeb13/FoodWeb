let userId = localStorage.getItem("UserID")
let orderData = document.getElementById("orderData")

async function getAllOrders() {
    await firebase.database().ref("UsersOrders").child(userId).get()
        .then((snap) => {
            // console.log(snap.val());
            let data = Object.values(snap.val())
            console.log(data);
            for (let index = 0; index < data.length; index++) {
                orderData.innerHTML += `
                <div class="col col-lg-4 col-md-6 col-sm-12 rounded">
                <div class="card mb-3 rounded">
                <div class="card-body rounded">
                  <h5 class="card-title"> Order No : ${index+1}</h5>
                  <p class="card-text mt-4"><b>Total Amount </b> : ${data[index]["toal_amount"]}</p>
                  <p class="card-text"><b>Status </b> : ${data[index]["status"]}</p>
                  <a href="#" class="btn btn-primary" id = "${data[index]["OrderKey"]}" onclick = "ViewOrderDetails(this)">Order Details</a>
                </div>
              </div>
              </div>
           `

            }
        })
}

getAllOrders()



function ViewOrderDetails(e) {
  // console.log(e.id)
  localStorage.setItem("CuurentUser_OrderKey" , e.id)
  window.location.href = "../Order Details/index.html"
} 

function logOut() {
  localStorage.clear()
  window.location.replace("../../index.html")
}