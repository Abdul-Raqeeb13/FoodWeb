let currentOrderDetailsKey = localStorage.getItem("current_order_detail_key")
let orderDetails = document.getElementById("orderDetails")
let ordersDishes = document.getElementById("ordersDishes")


function getOrderDetails() {
  firebase.database().ref("AllOrders").child(currentOrderDetailsKey).get()
    .then((snap) => {
      console.log(snap.val()["Dishes"]);

      orderDetails.innerHTML = `
        <div class="col-lg-4 col-md-4 col-sm-4"> User Name : ${snap.val()["UserName"]}</div>
        <div class="col-lg-4 col-md-4 col-sm-4"> Status : ${snap.val()["status"]}</div>
        <div class="col-lg-4 col-md-4 col-sm-4"> Total Amount : ${snap.val()["toal_amount"]}</div>
        `

      for (let index = 0; index < snap.val()["Dishes"].length; index++) {

        ordersDishes.innerHTML += `
             <div class="col-lg-4 col-md-3 col-sm-6 col-12">
             <div class="card mb-3">
             <img src="${snap.val()["Dishes"][index]["DishImage"]}" class="img-fluid card-img-top" alt="...">
             <div class="card-body">
               <h6 class="card-text">Dish Name : ${snap.val()["Dishes"][index]["DishName"]}</h6>
               <h6 class="card-text">Dish Price : ${snap.val()["Dishes"][index]["DishPrice"]}</h6>
               <h6 class="card-text">Quantity : ${snap.val()["Dishes"][index]["Quantity"]}</h6>
             </div>
           </div>
           </div>
       
        `
      }


    })
    .catch((e) => {
      console.log(e);

    })
}


getOrderDetails()




function logOut() {
  localStorage.clear()
  window.location.replace("../../index.html")
}

