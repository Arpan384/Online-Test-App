class Question{
    constructor(id,name,optionA,optionB,optionC,optionD,rightAns,score){
        this.id=id;
        this.name=name;
        this.optionA=optionA;
        this.optionB=optionB;
        this.optionC=optionC;
        this.optionD=optionD;
        this.rightAns=rightAns;
        this.score=score;
        this.markForDel=false;
    }
    /*markRev(){

        this.markForDel=!this.markForDel;
        //console.log(this.markForDel);
    }*/
}