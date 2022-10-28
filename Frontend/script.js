var state;
//Global variables
var url="http://localhost:4000/expensesData"
var downloadUrl="http://localhost:4000/download"
let UserUrl="http://localhost:4000/users"
var RazorPayKeyID="rzp_test_MPJj4ZO1IeYlzh"
var RazorPayKeySecret="XW3SvSuRi3NmhYPADGtZLiqe"

let amountInput=document.getElementById('amount')
let descInput=document.getElementById('desc')
let catgInput=document.getElementById('catg')
let darkBtn=document.getElementById('premium')
//button
let addBtn=document.getElementById('addBtn')
let logoutBtn=document.getElementById('logout')

//Event Listeners
addBtn.addEventListener('click', addExpense)
logoutBtn.addEventListener('click', logout)
darkBtn.addEventListener('click', handlePayment)

//Check if already Logged In
function checkAuthState(){
    state=JSON.parse(sessionStorage.getItem('auth'))
    if (state==null||state==undefined||state==''){
        location.replace('./auth.html')
    }else if (state.token){
        return
    }else{
        location.replace('./auth.html')
    }
}

checkAuthState()

function checkPremium(){
    axios({
        method: 'get',
        url: `${UserUrl}`,
        headers:{"Authorization":state.token}
    }).then(response=>{
        if(response.data.isPremium){
            isPremium()
        }
        else{
            return
        }
    }).catch(err=>console.log(err))
}

var isPremium=()=>{
    toggleMode()
    darkBtn.style.visibility='hidden'
    var download=document.getElementById('downloadBtn')
    download.style.display="inline-block"
    download.addEventListener('click', downloadExpenses)
};

function downloadExpenses(e){
    e.preventDefault()
    axios({
        method:'get',
        url: downloadUrl,
        headers: {Authorization:state.token},
        responseType: 'blob', // important
    }).then(response=>{
        const href = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'expenses.txt'); //or any other extension
        document.body.appendChild(link);
        link.click();
        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        console.log(response)
    }).catch(err=>console.log(err))
}

function createPremium(){
    axios({
        method: 'put',
        url: `${UserUrl}`,
        headers: {"Authorization":state.token}
    }).then(response=>{
        if(response.data.isPremium){
            isPremium()
        }
    }).catch(err=>console.log(err))
}

function handlePayment(){
    var options = {
        "key": RazorPayKeyID, 
        "amount": "500",
        "currency": "INR",
        "name": "Premium Membership",
        "description": "Buy Expense Tracker Premium Membership",
        // "order_id": state.token,
        "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
        "handler": function (response){
            alert("Payment was successful!")
            createPremium()
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        },
    };
    var rzp1=new Razorpay(options)
    rzp1.open();
    rzp1.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    })
}

function toggleMode(){
    document.body.classList.add('dark')
    document.querySelector('.inc-exp-container').classList.add('dark')
    let inputs=document.querySelectorAll('input')
    for (let i=0; i<inputs.length; i++){
        inputs[i].classList.add('dark')
    }
    let historyItems=document.querySelectorAll('.list li')
    for (let i=0; i<historyItems.length; i++){
        historyItems[i].classList.add('dark')
    }
}

function logout(){
    sessionStorage.removeItem('auth')
    checkAuthState()
}

//function for Adding Expense
async function addExpense(e){
    e.preventDefault()
    let amount=amountInput.value
    let desc=descInput.value
    let catg=catgInput.value

    if (amount=="" || amount==0 || isNaN(amount)){
        alert("Enter a valid amount!")
        return
    }

    else if (desc=="" || catg==""){
        alert("Enter valid description and category!")
        return
    }else{
        amountInput.value=""
        descInput.value=""
        catgInput.value=""
    }

    await axios({
        method: 'post',
        url: url,
        headers: {"Authorization":state.token},
        data: {
            amount: amount,
            desc: desc,
            catg:catg
        }
    }).then((response)=>{
        console.log(response)
        if(response.status==201){
            displayList()
        }
    }).catch(err=>console.log(err))

    
}

//function for Deleting Expense
async function deleteExpense(event){
    event.preventDefault()

    try{
        await axios({
            method: 'delete',
            url: `${url}/${event.target.id}`,
        })
        displayList()
    }
    catch(err){
        console.log(err)
    }
}

function editExpense(event){
    let id=event.target.id
    event.preventDefault()
    addBtn.removeEventListener('click', addExpense)
    addBtn.addEventListener('click', update)
    addBtn.innerHTML="Modify"
    let getRequest=async()=>{
        await axios({
        method: 'get',
        url: `${url}/${event.target.id}`
        }).then(res=>{
            amountInput.value=res.data.amount
            descInput.value=res.data.desc
            catgInput.value=res.data.catg
        }).catch(err=>console.log(err))
    }

    getRequest()
    
    async function update(e){
        e.preventDefault()
        let amount=amountInput.value
        let desc=descInput.value
        let catg=catgInput.value
        if (amount=="" || amount==0 || isNaN(amount) ){
            alert("Enter a valid amount!")
            return
        }
    
        else if (desc=="" || catg==""){
            alert("Enter valid description and category!")
            return
        }
        await axios({
            method: 'put',
            url: `${url}/${id}`,
            data: {
                amount:amount,
                desc:desc,
                catg:catg
            }
        })
       
        location.reload()
        // .then(res=>{
        //     if (res.status==200){
        //         location.reload()
        //     }else{
        //         console.log(res)
        //     }
        // }).catch(err=>console.log(err))
    }
}


function displayList() {
    let listGroup=document.getElementById('list')
    listGroup.innerHTML=""
    let getRequest=async()=>await axios({
        method: 'get',
        url: url,
        headers: {"Authorization":state.token}
    }).then(res=>{
        console.log(res)
        if (res.data.length==0 || !res.data){
            document.querySelector('h3').style.visibility="hidden"
            return
        }
        else{
            let inflow=0, outflow=0
            res.data.map((expenseDetails)=>{
            expenseDetails.amount>0?inflow+=parseFloat(expenseDetails.amount):outflow+=parseFloat(expenseDetails.amount)
            let listItem=document.createElement('li')
            let span=document.createElement('span')
            let amountItem=document.createTextNode(expenseDetails.amount>0?`+₹${(expenseDetails.amount*1).toLocaleString('en-IN')}`:`-₹${(expenseDetails.amount*-1).toLocaleString('en-IN')}`)
            let descItem=document.createTextNode(`${expenseDetails.desc}`)
            let catgItem=document.createTextNode(`${expenseDetails.catg}`)
            let delBtn=document.createElement('button')
            delBtn.className="delete-btn"
            delBtn.innerHTML=`<i id='${expenseDetails.id}' style='font-size:22px' class='fas'>&#xf1f8;</i>`
            let editBtn=document.createElement('button')
            editBtn.className="edit-btn"          
            editBtn.innerHTML=`<i id='${expenseDetails.id}' style='font-size:24px' class='far'>&#xf044;</i>`
            expenseDetails.amount>0?listItem.className="plus":listItem.className="minus";
            listItem.append(delBtn)
            listItem.append(amountItem)
            span.appendChild(descItem)
            listItem.append(span)
            listItem.append(catgItem)
            listItem.append(editBtn)
            listGroup.appendChild(listItem)
        })
        document.getElementById('money-minus').textContent=`-₹${parseFloat(outflow*-1).toLocaleString('en-IN')}`
        document.getElementById('money-plus').textContent=`+₹${parseFloat(inflow).toLocaleString('en-IN')}`
        let delBtn=document.querySelectorAll('.delete-btn')
        let editBtn=document.querySelectorAll('.edit-btn')
        for (let i=0; i<delBtn.length; i++){
            delBtn[i].addEventListener('click', deleteExpense)
            editBtn[i].addEventListener('click', editExpense)
        }
        checkPremium()
        }
    }).catch(err=>console.log(err))
    getRequest()
}

//Display the List of Expenses
window.addEventListener('DOMContentLoaded', ()=>{
    displayList()
})

