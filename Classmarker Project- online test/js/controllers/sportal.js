window.addEventListener("load",bindEvents);
function bindEvents(){
    if(!navigator.onLine){alert("Offline"); return;}
    document.querySelector("#logOut").addEventListener("click",logOut);
    loadFromServer();
    // if(user==undefined){alert("Not found"); return;}
    // else if(user["userType"]!="student"){alert("Unauthorized login"); localStorage.clear(); window.location.href="auth.html";}

    document.querySelector("#user").innerText=JSON.parse(localStorage.loggedInUser);
}
const user=JSON.parse(localStorage.loggedInUser);
function loadFromServer(){
    var allData = firebase.database().ref(`users`);

    allData.on('value',(snapshot)=>loadedData(snapshot));
}
//var duration;
var data;
//var test;
function loadedData(snapshot){
    data=snapshot.val();
    if(snapshot.val()==null){// speak('No data on server');
                            return;}
    //console.log(obj);
    loadAttempted(data[user]);
    for(let key in data){
        if(key["userType"]=="student"){delete data[key];}
    }
    for(let key in data){
        for(let key1 in data[key]["tests"]){
            var h4=document.createElement("h4");
            h4.classList.add("work");
            h4.classList.add("text-info");
            h4.innerHTML='<i class="fas fa-caret-right"></i>&nbsp;'+key1;
            h4.setAttribute("testId",key1);
            h4.setAttribute("teacher",key);
            h4.addEventListener("click",testLoad);
            document.querySelector("#tests").appendChild(h4);
        }
    }
}
 function testLoad(){
     localStorage.test=this.getAttribute("testId");
     localStorage.teacher=this.getAttribute("teacher");
     window.location.href="./answers.html";
 }
 function logOut(){
    localStorage.clear();
    window.location.href="../auth.html";
}

function loadAttempted(userObj){
    var res=document.querySelector("#results");
    if(userObj["attempted"]==null){
        var p=document.createElement("p");
        p.innerText="nil"; 
        res.appendChild(p); 
        return;
    }
    for(let key in userObj["attempted"]){
        var div=document.createElement("div");
        div.style.paddingLeft="10px"; div.style.paddingRight="10px";
        div.classList.add("bg-white","rounded");
        generateRes(div,key,userObj["attempted"][key]);
        res.appendChild(div);
    }
}

function generateRes(div,key,ob){
    var h5=document.createElement("h5"); h5.classList.add("alert-warning","text-center");
    h5.innerText=" "+key; div.appendChild(h5);
    var p1=document.createElement("p");
    p1.innerText="Score: "+ob.scored+"/"+ob.total; div.appendChild(p1);
    div.classList.add("blue");
    var hdiv=document.createElement("div"); 
    hdiv.classList.add("hide"); 
    div.addEventListener("click",toggleHide);
    //hdiv.setAttribute("id","hdiv");
    var qs=ob.answers.splice(1);
    //console.log(qs);

    hdiv.classList.add("black");
    for(let key of qs){// console.log(key,":",qs[key]);
        var adiv= document.createElement("div");
        for(let key1 in key){
            //console.log(key1);
            var p=document.createElement("p");
            p.innerText=" "+key1+" : "+key[key1];
            if(key1=="chosen"){p.classList.add("green");}
            if(key1=="id"){p.classList.add("red");}
            adiv.appendChild(p);
        }

        hdiv.appendChild(adiv); adiv.style.borderBottom="1px"; adiv.style.borderBottomStyle="dashed";
    }
    
    div.appendChild(hdiv);
    div.classList.add("border");
    div.classList.add("border-secondary");
}

function toggleHide(){
    this.childNodes[2].classList.toggle("hide");
    //var hdiv=document.querySelector("#hdiv");
    //console.log(id);
    //.classList.toggle("hide");
}