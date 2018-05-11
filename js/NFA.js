//
//
// function regexToNFA(regex){
//     var prevChar = "";
//     var input = "";
//
//
//     for(var i = 0; i < regex.length; i++){
//        input = regex.charAt(i);
//        switch(input){
//            case '*':
//                // Handle star
//                if((i - 1) == 0) {
//                    prevChar = regex.charAt(i - 1);
//                    NFA_TUPLE.push(state: "q0", letter: prevChar, transitions: (q0, q0));
//                    $('#acceptedTA').val(NFA_TUPLE);
//                }
//                INPUT_TYPE = "star";
//                break;
//            case '|':
//                // Handle union
//                INPUT_TYPE = "union";
//                break;
//            case '(':
//                // Handle open bracket
//                INPUT_TYPE = "oparen";
//                break;
//            case ')':
//                // Handle close bracket
//                INPUT_TYPE = "cparen";
//                break;
//            default:
//                INPUT_TYPE = "letter";
//
//                break;
//        }
//     }
// }