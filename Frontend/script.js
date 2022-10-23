//Global variables
var url="http://localhost:3000/expensesData"
let amountInput=document.getElementById('amount')
let descInput=document.getElementById('desc')
let catgInput=document.getElementById('catg')

//button
let addBtn=document.getElementById('addBtn')

//Event Listeners
addBtn.addEventListener('click', addExpense)
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
    }

    await axios({
        method: 'post',
        url: url,
        data: {
            amount: amount,
            desc: desc,
            catg:catg
        }
    }).then((response)=>{
        console.log(response)
        if(response.status==201){
            location.reload()
        }
    }).catch(err=>console.log(err))

    
}

//function for Deleting Expense
async function deleteExpense(event){
    event.preventDefault()

    try{
        await axios({
            method: 'delete',
            url: `${url}/${event.target.id}`
        })
        location.reload()
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

    let getRequest=async()=>await axios({
        method: 'get',
        url: url
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
        }
    }).catch(err=>console.log(err))
    getRequest()
}

//Display the List of Expenses
displayList()

