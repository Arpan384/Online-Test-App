const questionOperations={
    questions:[],
    add(ques){
        //console.log("call");
        this.questions.push(ques);
    },
    delRecords(){
       /* splice causes shuffling therefore higher time complexity  [input parameter->id]
        var quesIndex=this.questions.findIndex(ques=>ques.id==id);
        console.log(quesIndex);
        this.questions.splice(quesIndex,1);
        */
       this.questions=this.sort("id","A");
       this.questions= this.questions.filter(ques=>!ques.markForDel);
       for(let i=1;i<=this.questions.length;i++){this.questions[i-1].id=i;}
       return this.questions;
    },
    mark(id){
        var ques=this.search("id",id)[0];
        ques.markForDel=!ques.markForDel;
        //console.log(ques);
    },
    update(id){
        var ques=this.search("id",id)[0];
        for(let key in ques){
            if(key=="id")continue;
            if(key=="markForDel"){ques[key]=false; continue;}
            if(key=="rightAns"){ques[key]=rightAns(); continue;}
            ques[key]=getNewValue(key);
        }
        return this.questions;
    },
    search(key,value){
        if(key=="id"){
            var ques=this.questions.find(quesObj=>quesObj[key]==value);
            return [ques];
        }
        else if(key=="name"){value=value.toLowerCase();
            var qs=this.questions.filter(obj=>{
                var find=obj[key].toLowerCase();
                return find.includes(value);
            });
            return qs;
        }
        else {
            var qs=this.questions.filter(obj=>obj[key]==value);
            return qs;
        }
    },
    sort(key,order){
        if(key=='id'||key=='score'){
            if(order=='A')
            this.questions.sort((first,second)=>first[key]-second[key]);
            else 
            this.questions.sort((first,second)=>second[key]-first[key]);
        }
        else{
            if(order=='A')
            this.questions.sort((first,second)=>first[key].localeCompare(second[key]));
            else
            this.questions.sort((first,second)=>second[key].localeCompare(first[key]));
        }
        //this.questions.forEach(obj=>console.log(obj[key]));
        return this.questions;
    },
    unMarkCount(){
        return this.questions.length - this.markCount();
    },
    markCount(){
        return this.questions.filter(questionObject=>questionObject.markForDel).length;
    }
}