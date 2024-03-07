// let categoriesList = document.getElementById("categoriesList")
let table_data = document.getElementById("table_data")

let dishName = document.getElementById("dishName")
let dishPrice = document.getElementById("dishPrice")
let dishImage = document.getElementById("dishImage")

// let ImageView = document.getElementById("ImageView")
var imageUrl = ""
let storageRef = firebase.storage().ref()
let dbRef = firebase.database().ref("Dishes")

let CategoryItem = document.getElementsByClassName("CategoryItem")
let addCategoryBtn = document.getElementById("addCategoryBtn")

// edit work
let edit_cat_option = document.getElementById("edit_cat_option")
let dish_name_edit = document.getElementById("dish_name_edit")
let dish_price_edit = document.getElementById("dish_price_edit")
let editImageView = document.getElementById("editImageView")
let editdishImage = document.getElementById("editdishImage")


let dishkey = ""
let categorykey = ""
let categoryChange = ""
let check = false



// GET THE CATEGORIES IN ADD DISH CATEGORY OPTION
async function getCategories() {
    categoriesList.innerHTML = ""
    edit_cat_option.innerHTML = ""
    await firebase.database().ref("Category").get()
        .then((snap) => {
            let data = Object.values(snap.val())
            for (let Category in data) {
                categoriesList.innerHTML += `<option value="${data[Category]["cateKey"]}">${data[Category]["cateName"]}</option>`
                edit_cat_option.innerHTML += `<option value="${data[Category]["cateKey"]}">${data[Category]["cateName"]}</option>`
            }
        })
}


// this func run on change picture and call imageUpload function
dishImage.addEventListener("change", function (e) {
    imageUpload(e)
})
editdishImage.addEventListener("change", function (e) {
    imageUpload(e)
})
// upload image in firebase storag
function imageUpload(e) {

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
                editImageView.src = imageUrl
                addCategoryBtn.disabled = false

            });
        }
    );

}

async function addDish() {
    let dishKey = dbRef.push().getKey()
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

    // setAddText()

}




async function setCategoryData() {
    table_data.innerHTML = " "
    var mainData = [];
    // let newData;
    await dbRef.get().then((snapshoot) => {

        if (snapshoot.val() != undefined || snapshoot.val() != null) {
            var dataValues = Object.values(snapshoot.val())
            for (let i = 0; i < dataValues.length; i++) {
                var newData = Object.values(dataValues[i])

                for (var j in newData) {

                    mainData.push(newData[j])

                }
            }
        }


    })


    for (var i in mainData) {
        table_data.innerHTML += `
        <tr>
            <th scope="row">${(Number(i) + 1)}</th>
            <td>${mainData[i]["categoryname"]}</td>
            <td>${mainData[i]["DishName"]}</td>
            <td>${mainData[i]["DishPrice"]}</td>


            <td>
            <img src="${mainData[i]["DishImage"]}">
            </td>

            <td>
                <button class = "btn btn-warning" id = ${mainData[i]["DishKey"]}  value = ${mainData[i]["CateogoryKey"]} onclick = "editDish(this)" data-bs-toggle="modal" data-bs-target="#exampleModal1">Edit</button>
                <button class = "btn btn-danger"  id = ${mainData[i]["DishKey"]}  value = ${mainData[i]["CateogoryKey"]} onclick = "deleteDish(this)">Delete</button>
            </td>

        </tr>
        `

    }



}




setCategoryData();

getCategories()


function setAddText() {
    dishName.value = ""
    dishPrice.value = ""
    dishImage.value = ""
    getCategories()
}




function logOut() {
    localStorage.clear()
    window.location.replace("../../index.html")
}



async function editDish(e) {
    imageUrl = " "
    dishkey = e.id;      // dish key
    categorykey = e.value;   // category key 

    await firebase.database().ref("Dishes").child(categorykey).child(dishkey).get()
        .then((snap) => {

            for (let index = 0; index < edit_cat_option.length; index++) {
                if (snap.val()["categoryname"] == edit_cat_option[index].innerText) {

                    edit_cat_option[index].selected = true
                    categoryChange = edit_cat_option[index].innerText
                    dish_name_edit.value = snap.val()["DishName"]
                    dish_price_edit.value = snap.val()["DishPrice"]
                    editImageView.style.display = "inline"
                    editImageView.src = snap.val()["DishImage"]
                    imageUrl = snap.val()["DishImage"]
                    
                }
            }

        })
}


async function updateDish() {
    // console.log(categorykey);
    // console.log(edit_cat_option.value);


    await firebase.database().ref("Category").child(edit_cat_option.value).get()
    .then(async (snap) => {
        let categoryname = snap.val()["cateName"];
    
        if (categoryChange != categoryname) {
            console.log("categoryChange");
            const dishEditData = {

                CateogoryKey: edit_cat_option.value,
                DishImage: imageUrl,
                DishKey: dishkey,
                DishName: dish_name_edit.value,
                DishPrice: dish_price_edit.value,
                categoryname: categoryname

            }
            console.log(dishEditData);

            await firebase.database().ref("Dishes").child(categorykey).child(dishkey).remove()

            await firebase.database().ref("Dishes").child(edit_cat_option.value).child(dishkey).set(dishEditData)

            var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal1'));
            myModal.hide();

            setCategoryData()

            Toastify({

                text: "Dish updated with category",

                duration: 3000

            }).showToast();
        }
        else {
            console.log("not change");
            
            const dishEditData = {

                CateogoryKey: categorykey,
                DishImage: imageUrl,
                DishKey: dishkey,
                DishName: dish_name_edit.value,
                DishPrice: dish_price_edit.value,
                categoryname: categoryname

            }

            // this line make chnage in dishes refrence of firebase if we change the category but it still show in the 
            await firebase.database().ref("Dishes").child(categorykey).child(dishkey).update(dishEditData)

            var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal1'));
            myModal.hide();

            setCategoryData()

            Toastify({

                text: "Dish updated with no category change",

                duration: 3000

            }).showToast();

            // check = false
        }



    })
}


async function deleteDish(e) {

    await firebase.database().ref("Dishes").child(e.value).child(e.id).remove()

    setCategoryData()
    Toastify({

        text: "Dish Deleted",

        duration: 3000

    }).showToast();

}