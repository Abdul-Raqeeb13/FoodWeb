let categoriesCard = document.getElementById("categoriesCard")

async function getCategories() {
    categoriesCard.innerHTML = " "
    await firebase.database().ref("Category").get()
        .then((snap) => {
            // console.log(snap.val());
            let categories = Object.values(snap.val())
            // console.log(categories);
            for (const data in categories) {
                
                categoriesCard.innerHTML += `
                <div class="card col-lg-3 col-md-4 col-sm-6 col-12">
                <img src=${categories[data]["cateImage"]} class = "img-fluid">
                <div class="card-body">
                    <h5 class="card-title">${categories[data]["cateName"]}</h5>
                    <p class="card-text">${categories[data]["cateDescription"]}</p>
                    <a href="#" class="btn btn-primary" id = ${categories[data]["cateKey"]} onClick = viewDish(this)>View Dish</a>
                </div>
            </div>
                `

            }

            // for (let index = 0; index < categories.length; index++) {
            //     categoriesCard.innerHTML = `
            //     //     <div class="card col-lg-4 col-md-6 col-sm-6 col-12">
            //     //     <img src=${categories[index]["cateImage"]}>
            //     //     <div class="card-body">
            //     //         <h5 class="card-title">${categories[index]["cateName"]}</h5>
            //     //         <p class="card-text">${categories[index]["cateDescription"]}</p>
            //     //         <a href="#" class="btn btn-primary">Go somewhere</a>
            //     //     </div>
            //     // </div>
            //     //     `
                
            // }
        })
        .catch((e) => {
            console.log(e);
        })

}

function viewDish(e) {
    // console.log(e.id);
    localStorage.setItem("current_Category_Key" , e.id)
    window.location.href = "../Dish/index.html"
}

getCategories()