function parseInput(text){
    // This function will be used for parsing input and rejecting or accepting it
    // Imports from the file uploaded
    $('#outputTA').val(text);

    // Scroll to output
    $('html, body').animate({
        scrollTop: $("#output").offset().top
    }, 1000);
}