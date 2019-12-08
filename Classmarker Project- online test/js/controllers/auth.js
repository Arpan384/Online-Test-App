window.addEventListener("load",bindEvents);
function bindEvents(){
    if(!navigator.onLine){alert("You're Offline"); return;}
    document.querySelector("#login").addEventListener("click",login);
    document.querySelector("#register").addEventListener("click",register);
    loadFromServer();
    banner = document.querySelector("#slider");
    banner.addEventListener("mousemove", animateBg);
}

function login(){
    if(document.querySelector("#lin").classList.contains("hide")){document.querySelector("#lin").classList.remove("hide");
                                                                  document.querySelector("#reg").classList.add("hide");
                                                                  document.querySelector("#head").innerText="Login";
                                                                  console.log("log");
                                                                  clrL();
                                                                return;}
    var username=document.querySelector("#lid").value;
    var password=document.querySelector("#lpswd").value;
    // console.log(username,":id ",password," :pswd");
    //check
    if(username.trim().length==0||password.trim().length==0){alert("Invalid"); return;}
    if(users==null||users[username]==null){alert("Username not found");return;}
    else if(password===users[username]["pswd"]){userType=users[username]["userType"]; id=username; pswd=password; redirect();}
    else alert("Password is incorrect");
}
var id,pswd;
function register(){
    if(document.querySelector("#reg").classList.contains("hide")){document.querySelector("#reg").classList.remove("hide");
                                                                  document.querySelector("#lin").classList.add("hide");
                                                                  console.log("reg");
                                                                  document.querySelector("#head").innerText="Register";
                                                                  clrR();
                                                                return;}
    var username=document.querySelector("#rid").value;
    var password=document.querySelector("#rpswd").value;
    var cpassword=document.querySelector("#rcpswd").value;
    var st=document.querySelector("#student");
    var tc=document.querySelector("#teacher");
    if(st.checked)userType="student";
    else if(tc.checked) userType="teacher";

    if(username.trim().length==0||password.trim().length==0||userType==undefined){alert("Invalid"); return;}
    if(password===cpassword){ id=username; pswd=password;
    // console.log("user: ",userType);
    for(let key in users){
        if(key==id){alert("Username already taken"); return;}
    }
    saveToServer();
    loggedInUsername=username;
    }
    else alert("passwords do not match");
}
var userType;
function clrL(){
    document.querySelector("#lid").value="";
    document.querySelector("#lpswd").value="";
}

function clrR(){
    document.querySelector("#rid").value="";
    document.querySelector("#rpswd").value="";
    document.querySelector("#rcpswd").value="";
    document.querySelector("#student").checked=false;
    document.querySelector("#teacher").checked=false;
}

function saveToServer(){
    
    // speak('Saving to server');
    if(!navigator.onLine){alert("Offline, user not registered"); return;}
    var pr2=firebase.database().ref(`users/${id}/pswd`).set(pswd);
    pr2.then(res=>{alert("user registered");
                    firebase.database().ref(`users/${id}/userType`).set(userType).then(res=>{redirect();}).catch(t=>console.log("userType error ",t));
                }
            ).catch(t=>console.log("user error ",t));
}

function loadFromServer(){
    var questions = firebase.database().ref("users");
    questions.on('value',(snapshot)=>loadedData(snapshot));
}
var users;
function loadedData(snapshot){
     users=snapshot.val();
}

function redirect(){
    if(localStorage){
        var json=JSON.stringify(id);
        localStorage.loggedInUser=json;
        //alert("Data Saved   :D");
     }
     else{
         alert("Browser is outdated");
     }
    if(userType=="teacher")window.location.href="./views/tportal.html";
    else window.location.href="./views/sportal.html";
}

function animateBg() {
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    console.log(mouseX, mouseY);
    banner.style.transform  = 'translate(' + (-mouseX * 0.02) + "px," +(-mouseY * 0.02) + "px)";
}