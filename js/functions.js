function run(text){
    // Scroll to output
    $('html, body').animate({
        scrollTop: $("#output").offset().top
    }, 1000);

    TEST_INPUT = text;
    learnAlphabet(text);
    regexToNFA($('#regexBox').val());
}

// This function is used to parse through the test file and learn the alphabet
function learnAlphabet(text){
    // This just removed the newlines from the input file so they aren't rendered as part of the alphabet
    text = text.replace(/\r?\n?/g, '');
    var alphabet = [];
    for(var i = 0; i < text.length; i++){
        if((!alphabet.includes(text.charAt(i))) && (text.charAt(i) !== "\n"))
        alphabet.push(text.charAt(i));
    }
    FINAL_ALPHABET = alphabet;
    $('#acceptedTA').val("Alphabet from test file: " + alphabet);
}

// This is the bulk function that does most of the computing for converting the regular expression to an NFA
function regexToNFA(regex){
    var curChar = "";
    var prevChar = "";
    var nextChar = "";
    var input = "";
    var newNFA;

    // Many for loops are used to loop through the several arrays being used to store the NFA.
    // It is built through a process of parsing the input given by the user in a switch case
    for(var i = 0; i < regex.length; i++){
        input = regex.charAt(i);
        prevChar = regex.charAt(i - 1);
        curChar =  regex.charAt(i);
        nextChar = regex.charAt(i + 1);
        switch(input){
            case '*':
                if((i - 1) == 0) {
                    if(isLetter(nextChar)){
                        newNFA = {state: 0, transition: [prevChar, 0, prevChar, 1],accepting: true};
                    } else {
                        newNFA = {state: 0, transition: [prevChar, 0],accepting: true};
                    }
                    ACCEPTING_STATES.push(newNFA.state);
                    START_STATE = newNFA.state;
                    NFA_TUPLE.push(newNFA);
                } else if(i !== regex.length - 1 && isLetter(nextChar)){
                    newNFA = {state: ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+1), transition: [prevChar, ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+1), prevChar, ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+2)], accepting: true};
                    ACCEPTING_STATES.push(newNFA.state);
                    NFA_TUPLE.push(newNFA);
                } else if(i == regex.length - 1){
                    newNFA = {state: ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+1), transition: [regex.charAt(i - 2), ((NFA_TUPLE[NFA_TUPLE.length - 1].state))], accepting: true};
                    NFA_TUPLE.push(newNFA);
                    ACCEPTING_STATES.push(newNFA.state);
                }
                break;
            default:
                if((i == 0) && isLetter(nextChar)) {
                    newNFA = {state: 0, transition: [curChar, 1], accepting: false};
                    START_STATE = newNFA.state;
                    NFA_TUPLE.push(newNFA);
                } else if(i !== regex.length - 1 && isLetter(nextChar)){
                    newNFA = {state: ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+1), transition: [curChar, ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+2)], accepting: false};
                    NFA_TUPLE.push(newNFA);
                } else if(i == regex.length - 1 && regex.length !== 1){
                    newNFA = {state: ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+1), transition: [curChar, ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+2)], accepting: false};
                    NFA_TUPLE.push(newNFA);
                    newNFA = {state: ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+1), transition: [prevChar, ((NFA_TUPLE[NFA_TUPLE.length - 1].state))], accepting: true};
                    NFA_TUPLE.push(newNFA);
                    ACCEPTING_STATES.push(newNFA.state);
                } else if(i == regex.length - 1 && regex.length == 1){
                    newNFA = {state: 0, transition: [curChar, 1], accepting: false};
                    START_STATE = newNFA.state;
                    NFA_TUPLE.push(newNFA);
                    newNFA = {state: 1, transition: [], accepting: true};
                    NFA_TUPLE.push(newNFA);
                    ACCEPTING_STATES.push(newNFA.state);
                }
                break;
        }
    }
    matchTest();
}

// This is the functionality that determines if input matches. This is a little buggy, and I still cannot see the logic error that I know exists.
function matchTest(){
    $('#acceptedTA').val($('#acceptedTA').val() + "\n\n" + "Accepted lines from test file:" + "\n");
    var curState = 0;
    var currentLine = "";
    var lines = TEST_INPUT.split("\n");

    for(var q = 0; q < lines.length; q++) {
        curState = 0;
        var testLine = lines[q];

        for (var i = 0; i < testLine.length; i++) {
            var testChar = testLine.charAt(i);
            if(NFA_TUPLE[curState].transition.indexOf(testChar) !== -1) {
                for (var t = 0; t < (NFA_TUPLE[curState].transition.length); t++) {
                    if (isLetter(NFA_TUPLE[curState].transition[t])) {
                        if (testChar == NFA_TUPLE[curState].transition[t]) {
                            curState = NFA_TUPLE[curState].transition[t + 1];
                        }
                    }
                }
            } else {
                break;
            }
        }
        if(ACCEPTING_STATES.indexOf(curState) !== -1){
            $('#acceptedTA').val($('#acceptedTA').val() + testLine + "\n");
        }
    }
    generateDotNFA();
}

// Used for parsing purposes
function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

// Generates the DOT output from the NFA object array
function generateDotNFA(){
    var output = "NFA DOT OUTPUT\n";
    output += "dirgraph NFA {\n";
    output +=  "    start [shape = none, label = start];\n";
    output += "node [shape = circle];\n";
    for(var i = 0; i < NFA_TUPLE.length; i++){
        if(ACCEPTING_STATES.indexOf(NFA_TUPLE[i].state) == -1) {
            output += "    " + NFA_TUPLE[i].state + " [label = q" + NFA_TUPLE[i].state + "];\n";
        }
    }

    output += "node [shape = doublecircle];\n"
    for(var i = 0; i < NFA_TUPLE.length; i++) {
        if (ACCEPTING_STATES.indexOf(NFA_TUPLE[i].state) !== -1) {
            output += "    " + NFA_TUPLE[i].state + " [label = q" + NFA_TUPLE[i].state + "];\n";
        }
    }

    output += "node [shape = plaintext];\n";
    output += "     start -> q" + START_STATE + ";\n";
    for(var i = 0; i < NFA_TUPLE.length; i++) {
        for(var g = 0; g < NFA_TUPLE[i].transition.length; g++){
            if(isLetter(NFA_TUPLE[i].transition[g])){
                output += "    " + "q" + NFA_TUPLE[i].state + "-> q" + NFA_TUPLE[i].transition[g+1] + " [label = " + NFA_TUPLE[i].transition[g] + "];\n";
            }
        }
    }
        $('#nfaTA').val(output);
}

function saveFile()
{
    var contents = $('#nfaTA').val();
    var blob = new Blob([contents], {type:'text/plain'});
    var fileName = "NFA_DOT_Output";

    var link = document.createElement("a");
    link.download = fileName;
    link.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        link.href = window.webkitURL.createObjectURL(blob);
    }
    else
    {
        link.href = window.URL.createObjectURL(blob);
        link.onclick = destroyClickedElement;
        link.style.display = "none";
        document.body.appendChild(link);
    }

    link.click();
}