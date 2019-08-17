window.addEventListener("load",init);
function init(){
    
    if(!navigator.onLine){alert("Offline"); return;}
    loadFromServer();
    // if(user==undefined){alert("Not found"); return;}
    // else if(user["userType"]!="student"){alert("Unauthorized login"); localStorage.clear(); window.location.href="auth.html";}
    // //progress();
    document.querySelector("#prev").addEventListener("click",prev);
    document.querySelector("#next").addEventListener("click",next);
    document.querySelector("#skip").addEventListener("click",skip);
    document.querySelector("#submit").addEventListener("click",submit);
}
const user=JSON.parse(localStorage.loggedInUser);
const tname=localStorage.test;
const teacher=localStorage.teacher;
function loadFromServer(){
    var pr = firebase.database().ref(`users/${teacher}/tests/${tname}`);

    pr.on('value',(snapshot)=>loadedData(snapshot));
}
var duration;
//var data;
var test;
function loadedData(snapshot){
    test=snapshot.val();
    //console.log(test);
    if(snapshot.val()==null){// speak('No data on server');
                            return;}
    //console.log(obj);
    //data=test["questions"].splice(1);
    testLoad();
    
}

function testLoad(){
    //return;
    //document.querySelector("#tests").classList.toggle("hide");
    //document.querySelector("#main").classList.toggle("hide");
    var questions = test["questions"].splice(1);
    duration=test["duration"];
        //var questions=objects.splice(1);
        for(let q of questions){
            for(let key in q){if(key=="markForDel")delete q[key];}
            //console.log(q);
            q["chosen"]=false;
            answerOperations.questions.push(q);
            answerOperations.total=parseInt(answerOperations.total)+parseInt(q.score);
        }
       // console.log(answerOperations.questions);
    printQ();
}

function printQ(){
    var ques=answerOperations.questions[answerOperations.index];

    document.querySelector("#qid").innerText=ques.id;
    document.querySelector("#qname").innerText=ques.name;
    document.querySelector("#marks").innerText=ques.score;
    document.querySelector("#a").innerText=ques.optionA;
    document.querySelector("#b").innerText=ques.optionB;
    document.querySelector("#c").innerText=ques.optionC;
    document.querySelector("#d").innerText=ques.optionD;

    var ans=answerOperations.questions[answerOperations.index].chosen;
    if(ans!=false)document.querySelector("#"+ans).checked=true;
    document.querySelector("#options").addEventListener("click",mark);
    progress();
}

function prev(){
    if(answerOperations.index==0)return;
    //mark();
    answerOperations.index--;
    printQ();
}

function next(){
    if(answerOperations.index==answerOperations.questions.length-1)return;
    //mark();
    if(findTrue()!=false)document.querySelector("#"+findTrue()).checked=false;
    answerOperations.index++;
    printQ();
}

function skip(){
    unmark();
    // if(answerOperations.index==answerOperations.questions.length-1){return;}
    // answerOperations.index++;
    printQ();
}

function findTrue(){
    if(document.querySelector("#A").checked)return "A";
    else if(document.querySelector("#B").checked)return "B";
    else if(document.querySelector("#C").checked)return "C";
    else if(document.querySelector("#D").checked)return "D";
    else return false;
}

function mark(){

 var a=findTrue();
 //console.log(a);
 if(a!=false)answerOperations.mark(a);
 progress();
}
function unmark(){
    if(findTrue()){
answerOperations.unmark();
document.querySelector("#"+findTrue()).checked=false;
progress();
    }
}

function submit(){

    document.body.innerHTML="";
    for(let i=0;i<5;i++){
        document.body.appendChild(document.createElement("br"));
    }
    answerOperations.calc();
    var total=answerOperations.total;
    var scored=answerOperations.scored;
    var div=document.createElement("div");
    div.classList.add("container");
    var h2=document.createElement("h1");
    if(scored>total/3)h2.classList.add("alert-success","border-success"); 
    else h2.classList.add("alert-danger","border-danger"); 
    h2.classList.add("text-center","border");
    h2.innerHTML="<b>Score:- </b>"+scored+"/"+total;
    div.appendChild(h2);
    document.body.appendChild(div);
    server(scored,total);
    setTimeout(function(){
        localStorage.clear();
        localStorage.loggedInUser=JSON.stringify(user);
        window.location.href="./sportal.html";
    },5000);
}

function progress(){
    var count=0;
    for(let key of answerOperations.questions){
        if(key.chosen!=false)count++;
    }
    var percent=count*100/answerOperations.questions.length;
    document.querySelector("#prog1").style="width: "+percent+"%";
    document.querySelector("#prog1").innerHTML="Attempted "+percent+"%";
    document.querySelector("#prog2").style="width: "+(100-percent)+"%";
    document.querySelector("#prog2").innerText="Unattempted "+(100-percent)+"%";
}

function saveToServer(answerObject){
    var pr = firebase.database().ref(`users/${user}/attempted/${tname}/answers/`+answerObject.id).set(answerObject);
    pr.then(res=>{
    }).catch(err=>{
        console.log("Error is ",err);
    });
    
}

function server(scored,total){
    if(!navigator.onLine){speak("You're offline, result not saved"); return;}
    answerOperations.questions.forEach(ques=>saveToServer(ques));
    var pr1=firebase.database().ref(`users/${user}/attempted/${tname}/scored`).set(scored).then(res=>{}).catch(err=>{console.log("Error is ",err);});
    var pr2=firebase.database().ref(`users/${user}/attempted/${tname}/total`).set(total).then(res=>{}).catch(err=>{console.log("Error is ",err);});
}

