function run(text){
    // Scroll to output
    $('html, body').animate({
        scrollTop: $("#output").offset().top
    }, 1000);

    learnAlphabet(text);
}

function learnAlphabet(text){
    // This just removed the newlines from the input file so they aren't rendered as part of the alphabet
    text = text.replace(/\r?\n?/g, '');
    var alphabet = [];
    for(var i = 0; i < text.length; i++){
        if((!alphabet.includes(text.charAt(i))) && (text.charAt(i) !== "\n"))
        alphabet.push(text.charAt(i));
    }

    $('#acceptedTA').val("Alphabet from test file: " + alphabet);
}