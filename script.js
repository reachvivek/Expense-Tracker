//function for Adding Expense
function addExpense(){
    let amount=amountInput.value
    let desc=descInput.value
    let catg=catgInput.value

    let expensesArray=JSON.parse(localStorage.getItem('allExpenses'))
    if (!expensesArray || expensesArray.length==0 || expensesArray==undefined){
        expensesArray=[{
            amount: amount,
            desc: desc,
            catg:catg
        }]
        localStorage.setItem('allExpenses', JSON.stringify(expensesArray))
        location.reload() 
    }
    else{
        let expenseDetails={
            amount:amount,
            desc:desc,
            catg:catg
        }
        expensesArray.push(expenseDetails)
        localStorage.removeItem('allExpenses')
        localStorage.setItem('allExpenses', JSON.stringify(expensesArray))
        location.reload
    }
}

//function for Deleting Expense
function deleteExpense(event){
    alert(event.target.id)
}


function displayList() {
    let listGroup=document.getElementById('list')
    let expensesArray=JSON.parse(localStorage.getItem('allExpenses'))
    if(!expensesArray || expensesArray.length==0 || expensesArray==undefined){
        return
    }
    else{
        expensesArray.map((expenseDetails, index)=>{
            let listItem=document.createElement('li')
            let span=document.createElement('span')
            let amountItem=document.createTextNode(`-₹${expenseDetails.amount}`)
            let descItem=document.createTextNode(`${expenseDetails.desc}`)
            let catgItem=document.createTextNode(`${expenseDetails.catg}`)
            let delBtn=document.createElement('button')
            delBtn.className="delete-btn"
            delBtn.id=index
            delBtn.append(document.createTextNode('x'))
            let editBtn=document.createElement('button')
            editBtn.className="edit-btn"          
            editBtn.id=index
            editBtn.append(document.createTextNode('Edit'))
            listItem.className="minus"
            listItem.append(delBtn)
            listItem.append(amountItem)
            span.appendChild(descItem)
            listItem.append(span)
            listItem.append(catgItem)
            listItem.append(editBtn)
            listGroup.appendChild(listItem)
        })
    }
}


//Global variables
let amountInput=document.getElementById('amount')
let descInput=document.getElementById('desc')
let catgInput=document.getElementById('catg')

//button
let addBtn=document.getElementById('addBtn')

//Event Listeners
addBtn.addEventListener('click', addExpense)
delBtn.addEventListener('click' deleteExpense)

//Display the List of Expenses
displayList()




