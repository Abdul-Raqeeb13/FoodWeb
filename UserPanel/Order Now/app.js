let addToCard = JSON.parse(localStorage.getItem("Add_To_Card"))
let orderData = document.getElementById("orderData")
let finalOrderPrice = document.getElementById("finalOrderPrice")
let UserID = localStorage.getItem("UserID")
let Username = localStorage.getItem("UserName")
let orderBtn = document.getElementById("orderBtn")
let price = 0;


function getAllAddToCart() {
  orderData.innerHTML = " "
  // console.log(addToCard);
  for (var index in addToCard) {
    price += Number(addToCard[index]["Quantity"] * addToCard[index]["DishPrice"])
    orderData.innerHTML += `
        <tr>
        <th>${Number(index) + 1}</th>
        <td>${addToCard[index]["DishName"]}</td>
        <td>${addToCard[index]["Quantity"]}</td>
        <td>${addToCard[index]["DishPrice"]}</td>
        <td>${addToCard[index]["Quantity"] * addToCard[index]["DishPrice"]}</td>
     
      </tr>
        `
  }

  finalOrderPrice.innerText = price

}

getAllAddToCart()



async function SetDataForOrder() {
  if (addToCard == null) {
    Toastify({

      text: "Please select the item",

      duration: 3000

    }).showToast();
  } else {
    var orderKey = firebase.database().ref("UsersOrders").push().key

    let orderObject = {
      Dishes: addToCard,
      toal_amount: finalOrderPrice.innerText,
      status: "pending",
      userId: UserID,
      UserName: Username,
      OrderKey: orderKey
    }

    // console.log(orderObject);

    // user
    await firebase.database().ref("UsersOrders").child(UserID).child(orderKey).set(orderObject)

    // admin
    await firebase.database().ref("AllOrders").child(orderKey).set(orderObject)

    window.location.reload()
    localStorage.setItem("Add_To_Card", null)

    Toastify({

      text: "Order Submit",

      duration: 3000

    }).showToast();

  }



}



function logOut() {
  localStorage.clear()
  window.location.replace("../../index.html")
}