var state;
//Global variables
var url="https://expense-tracker-nodejs-app.herokuapp.com/expensesData"
var editurl="https://expense-tracker-nodejs-app.herokuapp.com/expenses"
var urlPages="https://expense-tracker-nodejs-app.herokuapp.com/pages"
var downloadUrl="https://expense-tracker-nodejs-app.herokuapp.com/download"
var downloadHistoryUrl="https://expense-tracker-nodejs-app.herokuapp.com/downloadHistory"
let UserUrl="https://expense-tracker-nodejs-app.herokuapp.com/users"
let leaderboardUrl="https://expense-tracker-nodejs-app.herokuapp.com/leaderboard"


let amountInput=document.getElementById('amount')
let descInput=document.getElementById('desc')
let catgInput=document.getElementById('catg')

//Buttons
let addBtn=document.getElementById('addBtn')
let logoutBtn=document.getElementById('logout')
let rows=document.getElementById('rows')
let darkBtn=document.getElementById('premium')
var allExpenses;

//Event Listeners
addBtn.addEventListener('click', addExpense)
logoutBtn.addEventListener('click', logout)
darkBtn.addEventListener('click', handlePayment)
rows.addEventListener('input', changePages)

function handlePayment(){
    location.href='./pricing.html'
}

//Check if already Logged In
function checkAuthState(){
    state=JSON.parse(sessionStorage.getItem('auth'))
    if (state==null||state==undefined||state==''){
        location.replace('./index.html')
    }else if (state.token){
        return
    }else{
        location.replace('./index.html')
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
            // console.log(response)
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
    logoutBtn.style.right='21rem'
    var download=document.getElementById('downloadBtn')
    var history=document.getElementById('historyBtn')
    history.style.display='inline-block'
    history.addEventListener('click', toggleDownloadHistory)
    document.querySelector('.right').style.display="flex"
    download.style.display="inline-block"
    download.addEventListener('click', downloadExpenses)
    rows.style.backgroundColor="#2c3849"
    rows.style.color="#fff"
    axios({
        method: 'get',
        url: leaderboardUrl
    }).then(response=>{
        const leaderboard=[]
        allExpenses=response.data.expenses;
        response.data.users.map(user=>{
            let entry={id:user.id, name:user.name}
            let total=0;
            response.data.expenses.map(expense=>{
                user.id==expense.userId?total+=expense.amount:null
            })
            entry.total=total
            leaderboard.push(entry)
        })
        leaderboard.sort((a,b)=>b.total-a.total)
        let userslist=document.querySelector('.users-list')
        userslist.innerHTML=""
        leaderboard.map(user=>{
            let list=document.createElement('li')
            list.id=user.id
            let p1=document.createElement('p')
            p1.id=user.id
            p1.innerHTML=user.name
            p1.style.fontWeight='600'
            let p2=document.createElement('p')
            p2.id=user.id
            p2.style.fontWeight='600'
            p2.style.color="#whitesmoke"
            p2.innerHTML=`₹ ${(user.total*1).toLocaleString('en-IN')}`
            list.appendChild(p1)
            list.appendChild(p2)
            userslist.appendChild(list)
        })
        userslist.addEventListener('click', showExpense)        
    }).catch(err=>console.log(err))
};

function toggleDownloadHistory(){
    axios({
        method: 'get',
        url: downloadHistoryUrl,
        headers:{'Authorization':state.token}
    }).then(response=>{
        document.getElementById('history-container').classList.add('active')
        let downloadList=document.getElementById('download-history')
        downloadList.innerHTML=""
        console.log(response)
        if(response.data.length!==0){
            let count=1
            response.data.map(res=>{
                let li=document.createElement('li')
                let a=document.createElement('a')
                a.innerHTML=`Expense ${count}`
                a.href=res.link
                li.appendChild(a)
                downloadList.appendChild(li)
                count++
            })
        }
        else{
            let li=document.createElement('li')
            let a=document.createElement('a')
            a.innerHTML="No Downloads Yet!"
            li.appendChild(a)
            downloadList.appendChild(li)
        }
    }).catch(err=>console.log(err))
    document.getElementById('close').addEventListener('click', closeDownloadHistory)
}

function closeDownloadHistory(){
    document.getElementById('history-container').classList.remove('active')
}

function showExpense(e){
    let listGroup=document.getElementById('list')
    listGroup.innerHTML=""
    if (allExpenses.length==0 || !allExpenses){
        document.querySelector('h3').style.visibility="hidden"
        return
    }
    else{
        allExpenses.map((expenseDetails)=>{
        if(expenseDetails.userId==e.target.id){
            let listItem=document.createElement('li')
            let span=document.createElement('span')
            let amountItem=document.createTextNode(expenseDetails.amount>0?`+₹${(expenseDetails.amount*1).toLocaleString('en-IN')}`:`-₹${(expenseDetails.amount*-1).toLocaleString('en-IN')}`)
            let descItem=document.createTextNode(`${expenseDetails.desc}`)
            let catgItem=document.createTextNode(`${expenseDetails.catg}`)
            expenseDetails.amount>0?listItem.className="plus":listItem.className="minus";
            listItem.append(amountItem)
            span.appendChild(descItem)
            listItem.append(span)
            listItem.append(catgItem)
            listGroup.appendChild(listItem)
            }
            toggleMode()
        })
    }
}

function changePages(){
    const val=parseInt(rows.value)
    axios({
        method: 'get',
        url: `${urlPages}/${val}`
    }).then(response=>{
        displayList()
    }).catch(err=>console.log(err))
}

function downloadExpenses(e){
    e.preventDefault()
    axios({
        method:'get',
        url: downloadUrl,
        headers: {Authorization:state.token},
        // responseType: 'blob', // important
    }).then(response=>{
        location.href=response.data
        // const href = URL.createObjectURL(response.data);
        // const link = document.createElement('a');
        // link.href = href;
        // link.setAttribute('download', 'expenses.txt'); //or any other extension
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        // URL.revokeObjectURL(href);
    }).catch(err=>console.log(err))
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
        url: `${editurl}/${event.target.id}`
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
        }else{
            amountInput.value=""
            descInput.value=""
            catgInput.value=""
            addBtn.removeEventListener('click', update)
            addBtn.addEventListener('click', addExpense)
            addBtn.innerHTML="Add Expense"
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
        displayList()
    }
}


function displayList(e) {
    let pageNo;
    try{
        pageNo=e.target.id
    }
    catch(err){
        pageNo=1
    }
    let listGroup=document.getElementById('list')
    listGroup.innerHTML=""
    let getRequest=async()=>await axios({
        method: 'get',
        url: `${url}/${pageNo}`,
        headers: {"Authorization":state.token}
    }).then(res=>{
        if (res.data.response==0 || !res.data.response){
            document.querySelector('h3').style.visibility="hidden"
            checkPremium()
            return
        }
        else{
            document.querySelector('h3').style.visibility="visible"
            res.data.response.map((expenseDetails)=>{
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
            var buttonList=document.querySelector('.pages-container')
            buttonList.innerHTML=""
            
            if(res.data.lastPage===2){
                if(res.data.hasPreviousPage){
                    let button=document.createElement('button')
                    button.innerHTML=res.data.previousPage
                    button.id=res.data.previousPage
                    buttonList.appendChild(button)
                }
                let button=document.createElement('button')
                button.innerHTML=res.data.currentPage
                button.id=res.data.currentPage
                buttonList.appendChild(button)
                if(res.data.hasNextPage){
                    let button=document.createElement('button')
                    button.innerHTML=res.data.nextPage
                    button.id=res.data.nextPage
                    buttonList.appendChild(button)
                }
            }
            else if(res.data.lastPage>2){
                if(res.data.hasPreviousPage){
                    let button=document.createElement('button')
                    button.innerHTML=res.data.previousPage
                    button.id=res.data.previousPage
                    buttonList.appendChild(button)
                }
                let button=document.createElement('button')
                button.innerHTML=res.data.currentPage
                button.id=res.data.currentPage
                buttonList.appendChild(button)
                if(res.data.hasNextPage){
                    let button=document.createElement('button')
                    button.innerHTML=res.data.nextPage
                    button.id=res.data.nextPage
                    buttonList.appendChild(button)
                }
                if(res.data.currentPage!=res.data.lastPage && res.data.nextPage!=res.data.lastPage){
                    let button=document.createElement('button')
                    button.innerHTML=res.data.lastPage
                    button.id=res.data.lastPage
                    buttonList.appendChild(button)
                }
            }
            buttonList.addEventListener('click', displayList)
            document.getElementById('money-minus').textContent=`-₹${parseFloat(res.data.negative*-1).toLocaleString('en-IN')}`
            document.getElementById('money-plus').textContent=`+₹${parseFloat(res.data.positive*1).toLocaleString('en-IN')}`
            let delBtn=document.querySelectorAll('.delete-btn')
            let editBtn=document.querySelectorAll('.edit-btn')
            for (let i=0; i<delBtn.length; i++){
                delBtn[i].addEventListener('click', deleteExpense)
                editBtn[i].addEventListener('click', editExpense)
            }
        }
        checkPremium()
    }).catch(err=>console.log(err))
    getRequest()
}

//Display the List of Expenses
window.addEventListener('DOMContentLoaded', ()=>{
    displayList()
})

