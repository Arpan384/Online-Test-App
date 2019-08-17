window.addEventListener("load",bindEvents);
function bindEvents(){
    if(!navigator.onLine){alert("Offline"); return;}
    document.querySelector("#logOut").addEventListener("click",logOut);
    loadFromServer();
    // if(user==undefined){alert("Not found"); return;}
    // else if(user["userType"]!="teacher"){alert("Unauthorized login"); localStorage.clear(); window.location.href="auth.html";}
     document.querySelector("#qcrud").addEventListener("click",newTest);
    document.querySelector("#user").innerText=JSON.parse(localStorage.loggedInUser);
}
const user=JSON.parse(localStorage.loggedInUser);
var tests;
function loadFromServer(){
    tests = firebase.database().ref(`users/${user}/tests`);
    tests.on('value',(snapshot)=>loadedData(snapshot));
}

function loadedData(snapshot){
    data=snapshot.val();
    
    if(snapshot.val()==null){// speak('No data on server');
                            return;}
    //console.log(obj);
    //console.log(data);
    for(let key in data){
         displayTest(data[key],key);
        // console.log(data[key],key);
    }
}

function displayTest(key,k){
    var t=document.querySelector("#tests");
    var li=document.createElement("li");
    var h5=document.createElement("h5");
    h5.innerText=k;
    // h5.classList.add("alert-warning","text-center");
    
    var p1=document.createElement("p");
    p1.innerText="Duration: "+key["duration"]+" sec";
    var count=0,score=0;
    //console.log(key["questions"]);
    var q=key["questions"].splice(1);
    //console.log(q);
    for(let key1 in q){
        score+=parseInt(q[key1]["score"]);
        //console.log(q[key1]["score"]);
        count++;
    }
    var p2=document.createElement("p");
    p2.innerText="Questions: "+count;
    var p3=document.createElement("p");
    p3.innerText="Max Score: "+score;
    
    // tdiv.style.paddingLeft="10px"; tdiv.style.paddingRight="10px";
    li.appendChild(h5);
    li.appendChild(p1); //p1.classList.add("bg-light");
    li.appendChild(p2); //p2.classList.add("bg-light");
    li.appendChild(p3); //p3.classList.add("bg-light");
    li.classList.add("border","rounded","border-success");
    t.appendChild(li);
}

function logOut(){
    localStorage.clear();
    window.location.href="../auth.html";
}
function newTest(){
    window.location.href="./questions.html";
}
