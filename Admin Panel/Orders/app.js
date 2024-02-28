let orders = document.getElementById("orders")

async function getAllOrders() {
    orders.innerHTML = ""
    await firebase.database().ref("AllOrders").get()
    .then((snap)=>{
        // console.log(Object.values(snap.val()));
        let data = Object.values(snap.val());
        console.log(data);

        for (let index = 0; index < data.length; index++) {
            orders.innerHTML += `
            <div class="col col-lg-4 col-md-6 col-sm-12">
            <div class="card">
            <div class="card-body">
              <h5 class="card-title">${data[index]["UserName"]}</h5>
              <p class="card-text mt-4"><b>Total Amount </b> : ${data[index]["toal_amount"]}</p>
              <p class="card-text"><b>No Of Dishes </b> : ${data[index]["Dishes"].length}</p>
              <a href="#" class="btn btn-danger">Reject</a>
              <a href="#" class="btn btn-primary">View Orders</a>
              <a href="#" class="btn btn-success">Accept</a>
            </div>
          </div>
          </div>
       `

        }

    })
}

getAllOrders()