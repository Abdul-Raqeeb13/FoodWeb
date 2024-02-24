let addToCard = JSON.parse(localStorage.getItem("Add_To_Card"))
let orderData = document.getElementById("orderData")
let finalOrderPrice = document.getElementById("finalOrderPrice")
let price = 0;

function getAllAddToCart() {
    orderData.innerHTML = " "
    // console.log(addToCard);
    for (var index in addToCard) {
        price += Number(addToCard[index]["Quantity"]*addToCard[index]["DishPrice"])
        orderData.innerHTML += `
        <tr>
        <th>${Number(index)+1}</th>
        <td>${addToCard[index]["DishName"]}</td>
        <td>${addToCard[index]["Quantity"]}</td>
        <td>${addToCard[index]["DishPrice"]}</td>
        <td>${addToCard[index]["Quantity"]*addToCard[index]["DishPrice"]}</td>
     
      </tr>
        `
    }

    finalOrderPrice.innerText = price

}

getAllAddToCart()
