function run(text){
    // Scroll to output
    $('html, body').animate({
        scrollTop: $("#output").offset().top
    }, 1000);

    TEST_INPUT = text;
    learnAlphabet(text);
    regexToNFA($('#regexBox').val());
}

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



function regexToNFA(regex){
    var curChar = "";
    var prevChar = "";
    var nextChar = "";
    var input = "";
    var newNFA;

    for(var i = 0; i < regex.length; i++){
        input = regex.charAt(i);
        prevChar = regex.charAt(i - 1);
        curChar =  regex.charAt(i);
        nextChar = regex.charAt(i + 1);
        switch(input){
            case '*':
                // Handle star
                if((i - 1) == 0) {
                    if(isLetter(nextChar)){
                        newNFA = {state: 0, transition: [prevChar, 0, prevChar, 1],accepting: true};
                    } else {
                        newNFA = {state: 0, transition: [prevChar, 0],accepting: true};
                    }
                    ACCEPTING_STATES.push(newNFA.state);
                    START_STATE = newNFA.state;
                    NFA_TUPLE.push(newNFA);
                    console.log(NFA_TUPLE);
                } else if(i !== regex.length - 1 && isLetter(nextChar)){
                    newNFA = {state: ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+1), transition: [prevChar, ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+1), prevChar, ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+2)], accepting: true};
                    NFA_TUPLE.push(newNFA);
                    console.log(NFA_TUPLE);
                } else if(i == regex.length - 1){
                    newNFA = {state: ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+1), transition: [prevChar, ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+1)], accepting: true};
                    NFA_TUPLE.push(newNFA);
                    ACCEPTING_STATES.push(newNFA.state);
                    console.log(NFA_TUPLE);
                }

                break;
            case '|':


                break;
            case '(':
                // Handle open bracket
                break;
            case ')':
                // Handle close bracket
                break;
            default:
                if((i == 0) && isLetter(nextChar)) {
                    newNFA = {state: 0, transition: [curChar, 1], accepting: false};
                    START_STATE = newNFA.state;
                    NFA_TUPLE.push(newNFA);
                    console.log(NFA_TUPLE);
                } else if(i !== regex.length - 1 && isLetter(nextChar)){
                    newNFA = {state: ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+1), transition: [curChar, ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+2)], accepting: false};
                    NFA_TUPLE.push(newNFA);
                    console.log(NFA_TUPLE);
                } else if(i == regex.length - 1){
                    newNFA = {state: ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+1), transition: [curChar, ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+2)], accepting: false};
                    NFA_TUPLE.push(newNFA);
                    newNFA = {state: ((NFA_TUPLE[NFA_TUPLE.length - 1].state)+1), accepting: true};
                    NFA_TUPLE.push(newNFA);
                    ACCEPTING_STATES.push(newNFA.state);
                    console.log(NFA_TUPLE);
                }
                break;
        }
    }
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}