let UserUrl="http://localhost:4000/users"
let switchCtn = document.querySelector("#switch-cnt");
let switchC1 = document.querySelector("#switch-c1");
let switchC2 = document.querySelector("#switch-c2");
let switchCircle = document.querySelectorAll(".switch__circle");
let switchBtn = document.querySelectorAll(".switch-btn");
let aContainer = document.querySelector("#a-container");
let bContainer = document.querySelector("#b-container");
let allButtons = document.querySelectorAll(".submit");
let signInBtn=document.getElementById("sign-in-btn")
let signUpBtn=document.getElementById("sign-up-btn")

signUpBtn.addEventListener('click', signUp)
signInBtn.addEventListener('click', signIn)

function signIn(){
    const email=document.getElementById('email-in').value
    const password=document.getElementById('pass-in').value
    if (email.length<5 || email.indexOf('@')==-1){
        alert("Enter a valid email!")
        return
    }
    else{
        document.getElementById('email-in').value=""
        document.getElementById('pass-in').value=""
    }
    axios({
        method: 'get',
        url: `${UserUrl}/${email}`,
    }).then(response=>{
        console.log(response)
        if (response.data==""){
            alert("Your email is not registered with us!")
            changeForm()
        }else if(response.data.password!==password){
            alert("You've entered an incorrect password!")
        }else{
            alert("Sign In Successful!")
            location.replace('./index.html')
        }
    }).catch(err=>console.log(err))
}

function signUp(){
    const name=document.getElementById('name-up').value
    const email=document.getElementById('email-up').value
    const password=document.getElementById('pass-up').value
    if (name.length<3 || !isNaN(name) || name==" "){
        alert("Enter a valid name!")
        return
    }
    else if (email.length<5 || email.indexOf('@')==-1){
        alert("Enter a valid email!")
        return
    }
    else if(password.length<4){
        alert("Enter a strong password!")
        return
    }else{
        document.getElementById('name-up').value=""
        document.getElementById('email-up').value=""
        document.getElementById('pass-up').value=""
    }
    axios({
        method: 'post',
        url: `${UserUrl}`,
        data:{
            name: name,
            email:email,
            password:password
        }
    }).then(response=>{
        console.log(response)
        if(response.data[1]==false){
            alert("You already have an account with us! Please Login...")
            changeForm()
        }
        else{
            alert("Sign Up Successful")
            window.location.replace("./index.html");
        }
    }).catch(err=>console.log(err))
}

let getButtons = (e) => e.preventDefault()

let changeForm = (e) => {
    
    switchCtn.classList.add("is-gx");
    setTimeout(function(){
        switchCtn.classList.remove("is-gx");
    }, 1500)

    switchCtn.classList.toggle("is-txr");
    switchCircle[0].classList.toggle("is-txr");
    switchCircle[1].classList.toggle("is-txr");

    switchC1.classList.toggle("is-hidden");
    switchC2.classList.toggle("is-hidden");
    aContainer.classList.toggle("is-txl");
    bContainer.classList.toggle("is-txl");
    bContainer.classList.toggle("is-z200");
}

let mainF = (e) => {
    for (var i = 0; i < allButtons.length; i++)
        allButtons[i].addEventListener("click", getButtons );
    for (var i = 0; i < switchBtn.length; i++)
        switchBtn[i].addEventListener("click", changeForm)
}

window.addEventListener("load", mainF);
