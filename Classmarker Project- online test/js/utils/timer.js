//var countDownDate = new Date("Jan 5, 2021 15:37:25").getTime();

// Update the count down every 1 second
var x = setInterval(function tim(){
    
  // Get todays date and time
  //var now = new Date().getTime();

  // Find the distance between now and the count down date
  //var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  
//   var hours = Math.floor(duration/3600);
//   var minutes = Math.floor(duration % (60 * 60));
//   var seconds = Math.floor(duration % (60));

//   // Display the result in the element with id="demo"
//   document.getElementById("timer").innerHTML = hours + "h "
//   + minutes + "m " + seconds + "s ";

//   // If the count down is finished, write some text
//   if (duration== 0) {
//     clearInterval(x);
//     document.getElementById("timer").innerHTML = "EXPIRED";
//   }
var hours = Math.floor(duration/3600);
var minutes = Math.floor((duration % (60 * 60))/60);
var seconds = Math.floor(duration % (60));

// Display the result in the element with id="demo"
if(duration!=undefined){
    var doc=document.getElementById("timer");
    if(doc!=null)doc.innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
    else return;
duration--;
// If the count down is finished, write some text
if (duration<0) {
  clearInterval(x);
  alert("Time Expired");
  document.getElementById("timer").innerHTML = "EXPIRED";
  submit();
}}
}, 1000);
