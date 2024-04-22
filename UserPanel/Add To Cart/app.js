let cardDishes = JSON.parse(localStorage.getItem("Add_To_Card"))
let addTocardDishes = document.getElementById("addTocardDishes")
let order_btn = document.getElementById("order_btn")


async function displayDish() {
 
    addTocardDishes.innerHTML = ""
    console.log(cardDishes);
    if (cardDishes == null) {
        order_btn.style.display = "none"
    } else {
        order_btn.style.display = "block"
    }
    for (const dish in cardDishes) {
        addTocardDishes.innerHTML += `
                <div class = "col-lg-3 col-md-4 col-sm-6 col-12 rounded">
                <div class="card rounded">
                <img src="${cardDishes[dish]["DishImage"]}" class="card-img-top rounded-top img-fluid" alt="...">
                    <div class="card-body rounded-bottom bg-dark">
                        <h5 class="card-title">${cardDishes[dish]["DishName"]}</h5>
                        <button type="button" class="btn btn-primary" onclick = incrementQuantity(this) id = ${dish}>+</button>
                        <p style = 'display:inline'>${cardDishes[dish]["Quantity"]}</p>
                        <button type="button" class="btn btn-primary" ${cardDishes[dish]["Quantity"] == 1 ? "disabled" : null} id = ${dish} onclick = decrementQuantity(this)>-</button>
                        <div style = "margin-top:10px">
                        <b>Price Rs.${cardDishes[dish]["DishPrice"]}</b></br>
                        <b>Toal Price Rs.${cardDishes[dish]["DishPrice"]*cardDishes[dish]["Quantity"]}</b>
                        <button type="button" class="btn btn-primary mt-2" id = ${dish} onclick = removeCart(this)>Remove Cart</button>
                        </div>
                    </div>

                </div>
                </div>
                
                    `

    }

}



displayDish()



function incrementQuantity(e) {
    let dishquantity = e.parentNode.childNodes[5].innerText;
    e.parentNode.childNodes[5].innerText = Number(dishquantity) + 1
    cardDishes[e.id]["Quantity"] = Number(dishquantity) + 1
    let totalCost = cardDishes[e.id]["Quantity"]*cardDishes[e.id]["DishPrice"]
    e.parentNode.childNodes[9].childNodes[4].innerText = "Toal Price Rs. " +totalCost
    localStorage.setItem("Add_To_Card" , JSON.stringify(cardDishes))
    if (e.parentNode.childNodes[5].innerText != 1) {
        e.parentNode.childNodes[7].removeAttribute("disabled");
    }



   

}

function decrementQuantity(e) {
    let dishquantity = e.parentNode.childNodes[5].innerText;
    if (dishquantity!= 1) {
        e.parentNode.childNodes[5].innerText = dishquantity - 1
        cardDishes[e.id]["Quantity"] = Number(dishquantity) - 1
        let totalCost = cardDishes[e.id]["Quantity"]*cardDishes[e.id]["DishPrice"]
        e.parentNode.childNodes[9].childNodes[4].innerText = "Toal Price Rs. " +totalCost
        localStorage.setItem("Add_To_Card" , JSON.stringify(cardDishes))
        if (e.parentNode.childNodes[5].innerText == 1) {
            e.disabled = "true"
        }
    } 
    
}


function removeCart(e) {
    cardDishes.splice([e.id],1)
    localStorage.setItem("Add_To_Card" , JSON.stringify(cardDishes))
    displayDish()

    
}


function logOut() {
    localStorage.clear()
    window.location.replace("../../index.html")
}