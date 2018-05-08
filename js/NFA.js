var states = [];
var transitions = [];
var starting = "";
var accepting = "";

function regexToNFA(regex){
    var input = "";
    for(var i = 0; i < regex.length; i++){
       input = regex.charAt(i);
       switch(input){
           case '*':
               // Handle star
               INPUT_TYPE = "star";
               break;
           case '|':
               // Handle union
               INPUT_TYPE = "union";
               break;
           case '(':
               // Handle open bracket
               INPUT_TYPE = "oparen";
               break;
           case ')':
               // Handle close bracket
               INPUT_TYPE = "cparen";
               break;
           default:
               INPUT_TYPE = "letter";
               break;
       }
    }


}