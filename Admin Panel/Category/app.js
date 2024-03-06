let CategoryName = document.getElementById("CategoryName")
let CategoryDescription = document.getElementById("CategoryDescription")
let CategoryImage = document.getElementById("CategoryImage")

let clearFormBtn = document.getElementById("clearFormBtn")
let addCategoryBtn = document.getElementById("addCategoryBtn")

let CategoryItem = document.getElementsByClassName("CategoryItem")

let ImageView = document.getElementById("ImageView")

let check = false

var imageUrl = ""

// this func run on change picture and call imageUpload function
CategoryImage.addEventListener("change", function (e) {
    // console.log(e.target.files[0])
    imageUpload(e)
})
let storageRef = firebase.storage().ref()
// upload image in firebase storag
function imageUpload(e) {

    // console.log(e.target.files[0])
    let uploadTask = storageRef.child(`Categories/${e.target.files[0].name}`).put(e.target.files[0])

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
                // cat_image.src = imageUrl


            });
        }
    );

}

databaseRef = firebase.database().ref("Category")
async function addNewCategory() {

    if (check == false) {   // chech updated gateory or add category if chechk false means category updated not add
        validData = CheckFormData()     // if form contain  correct data this will retuen truw
        if (validData) {
            // get the uniues key
            Categorykey = databaseRef.push().getKey()

            // object that containe data that are soted in firebase database 
            categoryData = {
                cateImage: imageUrl,
                cateName: CategoryName.value,
                cateDescription: CategoryDescription.value,
                cateKey: Categorykey
            }

            await databaseRef.child(Categorykey).set(categoryData)
            clearFormData()
            setCategoryData()



            Toastify({

                text: "Add New category",

                duration: 3000

            }).showToast();
        }
        else {
            // pass
        }



    }
    else {

        editCategoryData()
        setCategoryData()

        addCategoryText()

    }






}

// this will get data to the databse and show the data on the page
function setCategoryData() {
    CategoryItem[0].innerHTML = ""

    databaseRef.get().then((snapshoot) => {
        // console.log(snapshot.val())
        if (snapshoot.val() != undefined || snapshoot.val() != null) {
            var dataValue = Object.values(snapshoot.val())
            for (const i in dataValue) {
                //   console.log(dataValue[i]["cateImage"]);
                //   console.log(dataValue[i]["cateName"]);
                //   console.log(dataValue[i]["cateDescription"]);

                CardDiv = document.createElement("div")
                CardDiv.className = "rounded-top card col-sm-6 col-md-4"
                CardDiv.setAttribute("style", "width: 18rem;");

                image = document.createElement("img")
                // image.style.border = "1px solid black"
                image.src = dataValue[i]["cateImage"]
                image.className = "rounded-top"



                CardBodyDiv = document.createElement("div")
                CardBodyDiv.className = "card-body"

                cardTitle = document.createElement("h5")
                cardTitle.className = "card-title"
                cardTitle.innerText = dataValue[i]["cateName"]

                cardText = document.createElement("p")
                cardText.innerText = dataValue[i]["cateDescription"]

                deleteBtn = document.createElement("a")
                deleteBtn.className = "btn btn-danger"
                deleteBtn.setAttribute("id", dataValue[i]["cateKey"])
                deleteBtn.setAttribute('onclick', "deleteCategory(this)")
                deleteBtn.innerText = "Delete"

                editBtn = document.createElement("a")
                editBtn.className = "btn btn-warning"
                editBtn.setAttribute("id", dataValue[i]["cateKey"])
                editBtn.setAttribute('onclick', "editCategory(this)")
                editBtn.innerText = "Edit"


                CardDiv.appendChild(image)

                CardBodyDiv.appendChild(cardTitle)
                CardBodyDiv.appendChild(cardText)
                CardBodyDiv.appendChild(deleteBtn)
                CardBodyDiv.appendChild(editBtn)

                CardDiv.appendChild(CardBodyDiv)


                CategoryItem[0].prepend(CardDiv)
            }
        }


    })

}



// check enter coreect data in form 
function CheckFormData() {
    CategoryName.style.border = "none"
    CategoryImage.style.border = "none"
    CategoryDescription.style.border = "none"

    if (CategoryName.value.length == 0) {
        CategoryName.style.border = "5px solid red"
        return false
    }
    else if (CategoryDescription.value.length == 0) {
        CategoryDescription.style.border = "5px solid red"
        return false
    }
    else if (CategoryImage.value.length == 0) {
        CategoryImage.style.border = "5px solid red"
        return false
    }
    else {
        return true
    }
}

// clear all the form fields 
function clearFormData() {
    CategoryImage.value = ""
    CategoryDescription.value = ""
    CategoryName.value = ""
    addCategoryBtn.disabled = true
}




// delete category form page and also form the database
function deleteCategory(e) {

    // delete in page
    console.log(e.parentNode.parentNode.remove())
    // delete in database
    databaseRef.child(e.id).remove()

}

// this will containe the edited text on the form and change add category form behaviour to update category 
function editCategory(e) {

    CategoryName.value = e.parentNode.childNodes[0].innerText
    CategoryDescription.value = e.parentNode.childNodes[1].innerText
    ImageView.src = e.parentNode.parentNode.childNodes[0].src
    // CategoryImage.value = ""
    addCategoryBtn.innerText = "Update Category"
    ImageView.style.display = "inline"
    imageUrl = e.parentNode.parentNode.childNodes[0].src
    currentEditKey = e.id
    check = true
    addCategoryBtn.disabled = false



}


// this will containe updated category data and also change the database data
async function editCategoryData() {
    console.log(currentEditKey)

    const categoryEditData = {

        cateImage: imageUrl,
        cateName: CategoryName.value,
        cateDescription: CategoryDescription.value,
        cateKey: currentEditKey
    }

    await databaseRef.child(currentEditKey).update(categoryEditData)

    Toastify({

        text: "Category updated",

        duration: 3000

    }).showToast();

}


// after categoru updated form will change to add category behaviour
function addCategoryText() {
    CategoryName.value = ""
    CategoryDescription.value = ""
    CategoryImage.value = ""
    addCategoryBtn.innerText = "Add category"
    document.getElementById("ImageView").style.display = "none"
    document.getElementById("ImageView").src = ""
}

// call method to show the firebase database data on page
setCategoryData()



function logOut() {
    localStorage.clear()
    window.location.replace("../../index.html")
}

