var RazorPayKeyID="rzp_test_MPJj4ZO1IeYlzh"
var RazorPayKeySecret="XW3SvSuRi3NmhYPADGtZLiqe"
var state;
let UserUrl="https://expense-tracker-nodejs-app.herokuapp.com/users"

document.querySelector('.row').addEventListener('click', handlePayment)

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

function handlePayment(e){
    e.preventDefault()
    var options = {
        "key": RazorPayKeyID, 
        "amount": `${parseInt(e.target.id)*100}`,
        "currency": "INR",
        "name": "Premium Membership",
        "description": "Buy Expense Tracker Premium Membership",
        // "order_id": state.token,
        "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
        "handler": function (response){
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

function createPremium(){
    axios({
        method: 'put',
        url: `${UserUrl}`,
        headers: {"Authorization":state.token}
    }).then(response=>{
            alert("Payment was successful!")
            location.href='./dashboard.html';
    }).catch(err=>console.log(err))
}