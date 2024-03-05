let table_data = document.getElementById("table_data")
let total_pay = document.getElementById("total_pay")
var amountshow = document.getElementById("amountshow")
var amounttext = document.getElementById("amounttext")
let total_amount = 0

async function getAllPAyment() {
    await firebase.database().ref("Payments").get()
        .then((snap) => {
            table_data.innerHTML = ""
            let data = Object.values(snap.val());
            console.log(data);
            for (let index = 0; index < data.length; index++) {
                // console.log(data[index]["order "]["UserName"]);
                // console.log(data[index]["payment"]);
                // console.log(data[index]["order "]["status"]);
                total_amount += Number(data[index]["payment"])
                console.log(total_amount);
                table_data.innerHTML += `
                <tr>
                <th scope="row">${Number(index)+1}</th>
                <td>${data[index]["order "]["UserName"]}</td>
                <td>${data[index]["payment"]}</td>
                <td>${data[index]["order "]["status"]}</td>
              </tr>
                `
             
               
            }

            // total_pay.innerHTML = `
            // <td colspan="4">Total Amount : ${total_amount}</td>
            // `
          
            // amountshow.style.display="block"
            amounttext.innerText = total_amount
        })
     
}
getAllPAyment()