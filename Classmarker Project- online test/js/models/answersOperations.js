const answerOperations={
questions:[],index:0,total:0,scored:0,
mark(a){
    //console.log("call");
    this.questions[this.index]["chosen"]=a;
},
unmark(){
    this.questions[this.index]["chosen"]=false;
},
calc(){
    var count=0;
    for(let q of this.questions){
        if(q["chosen"]==q["rightAns"]){this.scored+=parseInt(q["score"]);  count++;}
        //console.log(q["chosen"],":",q["rightAns"]);
    }
    
    return count;
}
}