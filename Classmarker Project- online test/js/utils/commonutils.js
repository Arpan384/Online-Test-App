// var counter = 1;
// const doCount=()=>counter++;
//no use in Questions CRUD
function initCount(){
    var counter=1;
    function increaseCount(){
        return ++counter;
    }
    function tellCount(){
        return counter;
    }
    return [increaseCount,tellCount];
}
