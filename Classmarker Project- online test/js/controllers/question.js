window.addEventListener("load",bindEvents);

function speak(text, callback) {return ;
    var u = new SpeechSynthesisUtterance();
    //console.log(text.title);
    //console.log(text);
    if(text.title)u.text=text.title;
    else if(text.innerText){
        if(text.innerText.includes("Score"))u.text="Score";
        else if(text.innerText.includes("Question Id"))u.text="Question Id";
        else u.text=text.innerText;
    }
    else  u.text = text;
    
    u.lang = 'en-US';
 
    u.onend = function () {
        if (callback) {
            callback();
        }
    };
 
    u.onerror = function (e) {
        if (callback) {
            callback(e);
        }
    };
 
    speechSynthesis.speak(u);
}

function init(){
    showLoad();
    loadCount();
    displayCount();
    loadFromServer();
    hideLoad();
}

const inCount=()=>questionOperations.questions.length+1;
const loadCount=()=>document.querySelector("#id").innerText=inCount();
function displayCount(){
    //console.log(questionOperations.questions.length);
    //console.log("call");
    document.querySelector("#total").innerText=questionOperations.questions.length;
  /*  document.querySelector("#mark").innerText=questionOperations.questions.filter(quesObj=>quesObj.markForDel==true).length;
    document.querySelector("#unmark").innerText=questionOperations.questions.length-parseInt(document.querySelector("#mark").innerText);
    */
   document.querySelector("#mark").innerText=questionOperations.markCount();
   document.querySelector("#unmark").innerText=questionOperations.unMarkCount();
}

function bindEvents(){
    //document.querySelector("#scr").innerText="Score: 3";
    document.querySelector("#saveToServer").addEventListener("click",server);
    document.querySelector("#score").addEventListener("change",slider);
    document.querySelector("#add").addEventListener("click",addQuestion);
    document.querySelector("#delete").addEventListener("click",delQuestion);
    document.querySelector("#sort").addEventListener("click",showHideSort);
    document.querySelector("#sortDiv").addEventListener("change",doSort);
    document.querySelector("#load").addEventListener("click",load);
    document.querySelector("#save").addEventListener("click",save);
    document.querySelector("#search").addEventListener("click",showHideSearch);
    document.querySelector("#searchDiv").addEventListener("change",doSearch);
    document.querySelector("#clearAll").addEventListener("click",clear);
    document.querySelector("#fin").addEventListener("click",finish);
    document.querySelector("#create").addEventListener("click",testin);
}

function showHideSort(){
    
    document.querySelector("#sortDiv").classList.toggle("hide");
    // if(document.querySelector("#sortDiv").classList.contains("hide"))document.querySelector("#loading").classList.add("hide");
    // else document.querySelector("#loading").classList.remove("hide");
}
function showHideSearch(){
    //document.querySelector("#loading").classList.toggle("hide");
    document.querySelector("#searchDiv").classList.toggle("hide");
    if(document.querySelector("#searchDiv").className=="hide"){
        printRecords(questionOperations.questions);   
    }
}

function slider(){
    //console.log("slider");
    document.querySelector("#scr").innerText=document.querySelector("#score").value;
}

function createIcon(addClass,id,fn){
    var i=document.createElement("i");
    i.className=addClass;
    i.classList.add("work");
    i.setAttribute("qid",id);
    i.addEventListener("click",fn);
    return i;
}

function print(ques,col){
    showLoad();
    //document.querySelector("#loading").classList.remove("hide");
    var index=0;
var tbody=document.querySelector("#questions");
var row=tbody.insertRow();
if(col=="green")row.classList.toggle("alert-success");
for(let key in ques){ //console.log(key," is ",ques[key]);
    if(key=='markForDel')continue;
    var col=row.insertCell(index++);
    col.innerText=ques[key];
    //row.appendChild(col);
}
var td=row.insertCell(index);
//console.log(ques[id]);
td.appendChild(createIcon("fas fa-trash-alt mr-2",ques.id,toggleMark));
td.appendChild(createIcon("fas fa-edit",ques["id"],edit));
if(ques["markForDel"])row.classList.toggle("alert-danger");
hideLoad();
//document.querySelector("#loading").classList.add("hide");
}

function printRecords(arrQ){
    //console.log(arrQ);
    document.querySelector("#questions").innerHTML="";
    //console.log(arrQ);
    //if(printRecords.caller==loadedData)console.log("Server data");
    if(arrQ[0]==undefined&&printRecords.caller!=loadedData){}
    else if(printRecords.caller==doSearch)arrQ.forEach(quesObj=>print(quesObj,"green"));
    else arrQ.forEach(quesObj=>print(quesObj));
    displayCount();
}
function rightAns(){
    var temp;
    document.querySelector("#rightAns").childNodes.forEach(op=>{
        //console.log(op.value);
        if(op.checked==true && op.value!=undefined){temp=op.id; op.checked=false; return temp;}
        // console.log("id",op.id,typeof(op.id));
    });
    //console.log(temp,"temp");
    return temp;
}

function addQuestion(){
    var c=rightAns();
    //console.log(c,":",typeof(c));
    if(c==undefined)return;
    //console.log("call");
    showLoad();
    speak('Question added');
    var ques= new Question();
    for(let key in ques){
        if(key=='markForDel')continue;
        if(key=='id'){ques[key]=document.querySelector("#"+key).innerText; continue;}
        if(key=="rightAns"){ques[key]=c; continue;}
        ques[key]=document.querySelector("#"+key).value;
        document.querySelector("#"+key).value="";
    }
    slider();

    //console.log(ques);
    //qArr.push(ques);
    questionOperations.add(ques);
    
    loadCount();
    print(ques);
    displayCount();
    hideLoad();
    
}


function toggleMark(){
    var questionId = this.getAttribute("qid");
//console.log("Mark Toggle Call ",this.getAttribute("qid"));
//console.log("This is ",this);
var tr = this.parentNode.parentNode;
//tr.className = 'alert-danger';
tr.classList.toggle("alert-danger");
questionOperations.mark(questionId);
displayCount();

}


function unHook(){
    document.querySelector("#add").removeEventListener("click",addQuestion);
    document.querySelector("#delete").removeEventListener("click",delQuestion);
    document.querySelector("#sort").removeEventListener("click",showHideSort);
    document.querySelector("#sortDiv").removeEventListener("change",doSort);
    document.querySelector("#search").removeEventListener("click",showHideSearch);
    document.querySelector("#searchDiv").removeEventListener("change",doSearch);
}
function hook(){
    document.querySelector("#add").addEventListener("click",addQuestion);
    document.querySelector("#delete").addEventListener("click",delQuestion);
    document.querySelector("#sort").addEventListener("click",showHideSort);
    document.querySelector("#sortDiv").addEventListener("change",doSort);
    document.querySelector("#search").addEventListener("click",showHideSearch);
    document.querySelector("#searchDiv").addEventListener("change",doSearch);
}


function updateQuestion(){
    showLoad();
    speak('Question updated');
    var qid=this.getAttribute("qid");
    /* more complex code....reptrinting easier
    var ques=questionOperations.search(qid);
    var trs=document.querySelector("#questions").getElementsByClassName("alert-warning");
    //console.log("trs is ",trs[0].className);
    
    var index=0;
    var tr=trs[0]["childNodes"];
    console.log(tr);
    for(key in ques){
        if(key=='markForDel'){continue;}
        if(key=='id'){document.querySelector("#"+key).value=""; index++; continue;}
        ques[key]=document.querySelector("#"+key).value;
        document.querySelector("#"+key).value="";
        tr[index]["innerText"]=ques[key];
        index++;
    }
    trs[0].classList.addClass("alert-warning");
    */
   printRecords(questionOperations.update(qid));
   /*document.querySelector("#id").innerText=~*/loadCount();
   displayCount();
    slider();
    document.querySelector("#update").removeAttribute("qid");
    document.querySelector("#update").removeEventListener("click",updateQuestion);
    document.querySelector("#add").addEventListener("click",addQuestion);
    hook();
    displayCount();
    hideLoad();
}

function getNewValue(key){
 var value=document.querySelector("#"+key).value;
 document.querySelector("#"+key).value="";
 return value;
}

function edit(){
    unHook();
    
var delEdits=document.querySelectorAll(".work");
//console.log(delEdits);
delEdits.forEach(elem=>{elem.classList.toggle("work"); elem.classList.toggle("dontWork");
                        if(elem.classList.contains("fa-trash-alt")){elem.removeEventListener("click",toggleMark);}
                        else elem.removeEventListener("click",edit);}
                        );
var qid=this.getAttribute("qid");
var ques=questionOperations.search("id",qid)[0];
var tr=this.parentNode.parentNode;
if(ques["markForDel"])tr.classList.toggle("alert-danger");
ques.markForDel=false;
//console.log(ques);
for(let key in ques){//console.log(key);
    if(key=='markForDel')continue;
    if(key=='id'){document.querySelector("#"+key).innerText=ques[key]; continue;}
    if(key=="rightAns"){document.querySelector("#"+ques[key]).checked=true; continue;}
    document.querySelector("#"+key).value=ques[key];
}
slider();
tr.classList.toggle("alert-warning");
document.querySelector("#update").setAttribute("qid",qid);
document.querySelector("#update").addEventListener("click",updateQuestion);

//console.log("tr ",tr);
}

const delQuestion=()=>{
    /* higher complexity using loop, filter and remove child......reprinting more efficient 
    var tbody= document.querySelector("#questions");
    var trs=tbody.getElementsByClassName("alert-danger");
    if(trs.length==0)return;
    //console.log(trs);
    var i=0;
    while(i<trs.length){
    
    var id=trs[i]["childNodes"][0].innerText;
    console.log(id);
    questionOperations.delete(id);
    tbody.removeChild(trs[i]); 
    }
    */
   showLoad();
   if(questionOperations.questions.length==0){ speak("No data");return;}
   var l=questionOperations.questions.length;
   var afterDel=questionOperations.delRecords();
   printRecords(afterDel);
   if(l==afterDel.length){ speak("Nothing marked for deletion");return;}
   else speak('Marked questions deleted');
   loadCount();
   hideLoad();
}

function doSort(){
    showLoad();
    if(questionOperations.questions.length==0){ speak("No data"); hideLoad();return;}
    speak('Sorting');
    var sortBy=document.querySelector("#sortBy").value;
    var ascDsc=document.querySelector("#ascDsc").checked;
    //console.log(sortBy,"      ",ascDsc);
    if(sortBy=='null'){hideLoad(); return;}
    var qArr;
    if(!ascDsc)qArr=questionOperations.sort(sortBy,"A");
    else qArr=questionOperations.sort(sortBy,"D");
    printRecords(qArr);
    displayCount();
    hideLoad();
    //document.querySelector("#loading").classList.add("hide");
}

//const loader=()=> printRecords(questionOperations.sort("id","A"));

function doSearch(){
    showLoad();
    if(questionOperations.questions.length==0){ speak("No data"); hideLoad(); return;}
    speak('Searching');
    var key=document.querySelector("#searchBy").value;
    var value=document.querySelector("#searchKey").value;
    printRecords(questionOperations.search(key,value));
    displayCount();
    hideLoad();
    //document.querySelector("#loading").classList.add("hide");
}

function save(){
    showLoad();
    speak('Saving to local Storage');
 if(localStorage){
    var json=JSON.stringify(questionOperations.questions);
    localStorage.ptest=json;
    localStorage.ptest.duration=JSON.stringify(ttime);
    alert("Data Saved   :D");
 }
 else{
     alert("Browser is outdated   :(");
 }
 hideLoad();
}

function load(){
    showLoad();
    if(localStorage){
        if(localStorage.ptest){
            speak('Loading from local Storage');
            var ques=JSON.parse(localStorage.ptest);
            questionOperations.questions=ques;
            printRecords(questionOperations.questions);
            for(let key in ques[0]){
                if(key=='markForDel')continue;
                if(key=='id'){continue;}
                if(key=="rightAns"){if(rightAns()!=undefined)document.querySelector("#"+rightAns()); continue;}
                document.querySelector("#"+key).value="";
            }
            loadCount();
            displayCount();
            slider();
        }
        else{
            speak('Local Storage empty');
            alert("No Data in Local Storage :|");
        }
    }
    else{
        alert("Browser is outdated   :(");
    }
    hideLoad();
}
/*
function saveToServer(questionObject,no,yes){
    
    // speak('Saving to server');
    if(navigator.onLine)firebase.database().ref(`users/${loggedInUser}/tests/${tname}`).set(null);
    else {alert("offline"); return;}
    var pr2=firebase.database().ref(`users/${loggedInUser}/tests/${tname}/duration`).set(ttime/1000);
    pr2.then(res=>{}).catch(t=>console.log("time error ",t));
    var pr = firebase.database().ref(`users/${loggedInUser}/tests/${tname}/questions/`+questionObject.id).set(questionObject);
    pr.then(res=>{
       //yes();
    //    document.querySelector("#loading").classList.add("hide");
    }).catch(err=>{
        //no();
        // document.querySelector("#loading").classList.add("hide");
        console.log("Error is ",err);
    });
    
}*/
function stsCallbackE(err){
    alert("Records Not Saved");
}
function stsCallbackR(res){
    alert("Record Saved...");
}



function saveToServer(questionObject){
    var pr = firebase.database().ref(`users/${loggedInUser}/tests/${tname}/questions/`+questionObject.id).set(questionObject);
    pr.then(res=>{
        alert("Record Saved...");
    }).catch(err=>{
        alert("Record Not Saved");
        console.log("Error is ",err);
    });
    var pr2=firebase.database().ref(`users/${loggedInUser}/tests/${tname}/duration`).set(ttime/1000);
    pr2.then().catch();
}




function server(){
    showLoad();
    if(!navigator.onLine){alert("You're offline, test not uploaded");save(); hideLoad(); return;}
    var pr=firebase.database().ref(`users/${loggedInUser}/tests/${tname}`).set(null);
    speak('Saving to server');
    document.querySelector("#loading").classList.remove("hide");
    questionOperations.questions.forEach(ques=>saveToServer(ques,stsCallbackE,stsCallbackR));
    hideLoad();
}



function loadFromServer(){
    if(!navigator.onLine){speak("You're Offline"); return;}
    speak('Calling server');
    var questions = firebase.database().ref(`users/${loggedInUser}/tests/${tname}/questions`);
   // console.log(questions," fb=",firebase," db=",firebase.database()["INTERNAL"]);
   // for(let key in firebase.database())console.log(key," : ",firebase.database()[key]);

    questions.on('value',(snapshot)=>loadedData(snapshot)/*(snapshot)=>{
        var objects = snapshot.val();
        console.log("Objects are ",objects.splice(1));
        printRecords(objects.splice(1));
    }*/);
}


function loadedData(snapshot){
    
    var objects = snapshot.val();
        //console.log("Objects are ",objects.splice(1));
        //console.log(snapshot.val());
        if(snapshot.val()==null){ speak('No data on server');return;}
        questionOperations.questions=objects.splice(1);
        //console.log(questionOperations.questions);
        printRecords(questionOperations.questions);
        loadCount();
        displayCount();
}

function clear(){
    showLoad();
    speak('Everything Cleared!');
    localStorage.clear();
    localStorage.loggedInUser=JSON.stringify(loggedInUser);
    //console.log(localStorage.loggedInUser);
    document.querySelector("#questions").innerHTML="";
    questionOperations.questions=[];
    //firebase.database().ref.remove();

    /*var adaRef = firebase.database().ref('questions');
adaRef.remove()
  .then(function() {
    alert("Remove succeeded.")
  })
  .catch(function(error) {
    alert("Remove failed: " + error.message)
  });*/

  if(navigator.onLine){  firebase.database().ref(`users/${loggedInUser}/tests/${tname}/`).set(null);
  alert("Server data cleared!!");}
  loadCount();
  displayCount();
  hideLoad();
}
 
// say a message
function callMe(obj){
    //console.log("obj is ",obj.id);
    var addr=document.querySelector("#"+obj.id);
    if(obj.id=="id"){speak(addr.innerText);}
    else {speak(addr.value);}
}

function showLoad(){
    document.querySelector("#loading").classList.remove("hide");
}
function hideLoad(){
    document.querySelector("#loading").classList.add("hide");
}

function finish(){
    //console.log("called");
    if(questionOperations.questions.length==0){
        alert("No Questions, test not created!!");
        return;
    }
    server();
    document.body.innerHTML="";
    for(let i=0;i<5;i++){
        document.body.appendChild(document.createElement("br"));
    }
    var div=document.createElement("div");
    div.classList.add("container");
    var h1=document.createElement("h1");
    h1.classList.add("bg-dark","text-white","text-center","border","border-light");
    h1.innerText="Test Created Successfully";
    div.appendChild(h1);
    //console.log("call");
    document.body.appendChild(div);
    //document.body.appendChild(h1);
    setTimeout(function(){window.location.href="./tportal.html"},5000);
}
 var tname;
var ttime;
function testin(){
    // if(loggedInUser==undefined){alert("Not found"); return;}
    // else if(loggedInUser["userType"]!="teacher"){alert("Unauthorized login"); localStorage.clear(); window.location.href="auth.html";}

    tname=document.querySelector("#testnm").value;
    ttime=document.querySelector("#testtm").valueAsNumber;
    if(tname==""){return;}
    if(isNaN(ttime))return;
    //console.log(ttime);
    //console.log(tname,"   ",ttime);
    document.querySelector("#testin").classList.add("hide");
    document.querySelector("#main").classList.remove("hide");
    init();
}

 const loggedInUser=JSON.parse(localStorage.loggedInUser);