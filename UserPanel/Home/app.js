let categoriesCard = document.getElementById("categoriesCard")

async function getCategories() {
    categoriesCard.innerHTML = " "
    await firebase.database().ref("Category").get()
        .then((snap) => {
            let categories = Object.values(snap.val())
            for (const data in categories) {
                categoriesCard.innerHTML += `
                <div class = "col-lg-3 col-md-4 col-sm-6 col-12">
                <div class="card h-100">
                <img src=${categories[data]["cateImage"]} class = "img-fluid">
                <div class="card-body">
                    <h5 class="card-title">${categories[data]["cateName"]}</h5>
                    <p class="card-text">${categories[data]["cateDescription"]}</p>
                    <a href="#" class="btn btn-primary" id = ${categories[data]["cateKey"]} onClick = viewDish(this)>View Dish</a>
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

function viewDish(e) {
    localStorage.setItem("current_Category_Key", e.id)
    window.location.href = "../Dish/index.html"
}

getCategories()

function logOut() {
    localStorage.clear()
    window.location.replace("../../index.html")
}

