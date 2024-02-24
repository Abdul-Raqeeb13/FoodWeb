// let categoriesList = document.getElementById("categoriesList")
let table_data = document.getElementById("table_data")

let dishName = document.getElementById("dishName")
let dishPrice = document.getElementById("dishPrice")
let dishImage = document.getElementById("dishImage")

let ImageView = document.getElementById("ImageView")
var imageUrl = ""
let storageRef = firebase.storage().ref()
let dbRef = firebase.database().ref("Dishes")

let CategoryItem = document.getElementsByClassName("CategoryItem")
let addCategoryBtn = document.getElementById("addCategoryBtn")

// GET THE CATEGORIES IN ADD DISH CATEGORY OPTION
async function getCategories() {
    categoriesList.innerHTML = ""
    await firebase.database().ref("Category").get()
        .then((snap) => {
            let data = Object.values(snap.val())
            for (let Category in data) {
                categoriesList.innerHTML += `<option value="${data[Category]["cateKey"]}">${data[Category]["cateName"]}</option>`
            }
        })
}


// this func run on change picture and call imageUpload function
dishImage.addEventListener("change", function (e) {
    imageUpload(e)
})
// upload image in firebase storag
function imageUpload(e) {

    // console.log(e.target.files[0])
    let uploadTask = storageRef.child(`Dishes/${e.target.files[0].name}`).put(e.target.files[0])

    uploadTask.on('state_changed',
        (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            addCategoryBtn.disabled = true
        },
        (error) => {
            // Handle unsuccessful uploads
        },
        () => {

            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                imageUrl = url
                console.log('File available at', url);
                ImageView.src = imageUrl
                addCategoryBtn.disabled = false



            });
        }
    );

}

async function addDish() {
    let dishKey = dbRef.push().getKey()
    // console.log(dishKey)
    await firebase.database().ref("Category").child(categoriesList.value).get().then(async (snap) => {
        let categoryname = snap.val()["cateName"];
        const dishData = {
            CateogoryKey: categoriesList.value,
            categoryname,
            DishKey: dishKey,
            DishName: dishName.value,
            DishImage: imageUrl,
            DishPrice: dishPrice.value,
        }

        await dbRef.child(categoriesList.value).child(dishKey).set(dishData)

        var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal'));
        myModal.hide();

        Toastify({

            text: "New dish added",

            duration: 3000

        }).showToast();
    })

    setCategoryData()

}




async function setCategoryData() {
    table_data.innerHTML = " "
    var mainData = [];
    // let newData;
    await dbRef.get().then((snapshoot) => {

        if (snapshoot.val() != undefined || snapshoot.val() != null) {
            var dataValues = Object.values(snapshoot.val())
            // console.log(dataValues);
            for (let i = 0; i < dataValues.length; i++) {
                var newData = Object.values(dataValues[i])
                // console.log(newData)                
                for (var j in newData) {
                    // console.log(newData[j])
                    mainData.push(newData[j])

                }
            }
        }


    })


    for(var i in mainData){
        // console.log(mainData[i])
        table_data.innerHTML += `
        <tr>
<th scope="row">${(Number(i) + 1)}</th>
<td>${mainData[i]["categoryname"]}</td>
<td>${mainData[i]["DishName"]}</td>
<td>${mainData[i]["DishPrice"]}</td>


<td>
<img src="${mainData[i]["DishImage"]}">
</td>

</tr>
        `

    }
    
// console.log(mainData)


}

//     for (var i in mainData) {
//         CardDiv = document.createElement("div")
//         CardDiv.className = "rounded-top card col-sm-6 col-md-4"
//         CardDiv.setAttribute("style", "width: 18rem;");

//         image = document.createElement("img")
//         // image.style.border = "1px solid black"
//         image.src = mainData[i]["DishImage"]
//         image.className = "rounded-top"



//         CardBodyDiv = document.createElement("div")
//         CardBodyDiv.className = "card-body"

//         cardTitle = document.createElement("h5")
//         cardTitle.className = "card-title"
//         cardTitle.innerText = mainData[i]["categoryname"]

//         cardText = document.createElement("p")
//         cardText.innerText = mainData[i]["DishName"]

//         deleteBtn = document.createElement("a")
//         deleteBtn.className = "btn btn-danger"
//         // deleteBtn.setAttribute("id", dataValue[i]["cateKey"])
//         deleteBtn.setAttribute('onclick', "deleteCategory(this)")
//         deleteBtn.innerText = "Delete"

//         editBtn = document.createElement("a")
//         editBtn.className = "btn btn-warning"
//         // editBtn.setAttribute("id", dataValue[i]["cateKey"])
//         editBtn.setAttribute('onclick', "editCategory(this)")
//         editBtn.innerText = "Edit"


//         CardDiv.appendChild(image)

//         CardBodyDiv.appendChild(cardTitle)
//         CardBodyDiv.appendChild(cardText)
//         CardBodyDiv.appendChild(deleteBtn)
//         CardBodyDiv.appendChild(editBtn)

//         CardDiv.appendChild(CardBodyDiv)


//         CategoryItem[0].prepend(CardDiv)


//         // console.log(mainData[i])
// //         table_data.innerHTML += `
// //         <tr>
// // <th scope="row">${(Number(i) + 1)}</th>
// // <td>${mainData[i]["categoryname"]}</td>
// // <td>${mainData[i]["DishName"]}</td>
// // <td>${mainData[i]["DishPrice"]}</td>


// // <td>
// // <img src="${mainData[i]["DishImage"]}"  />
// // </td>

// // </tr>
// //         `

// //     }
// //     // console.log(mainData)

// }



setCategoryData();

getCategories()