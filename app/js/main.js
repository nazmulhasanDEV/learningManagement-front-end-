$('.actions').hide()

// folder actions 
function showActions(actionNum) {
    $('.actions').hide();
    $(`.actn-${actionNum}`).toggle();
}
function hideActions(actionNum) {
    $(`.actn-${actionNum}`).toggle();
}

// nav toggle 
$('#toggle').on('click', function () {
    $('.nav-div').slideToggle(200);
    $('.line-1').toggleClass('rotate-1');
    $('.line-2').toggleClass('visibility');
    $('.line-3').toggleClass('rotate-2');
});


// exercise 2 
const alternatives = document.querySelectorAll('.alternative')
function clickAlternative(color, e) {
    e.target.style.backgroundColor = color
    alternatives.forEach(element => {
        element.style.pointerEvents = 'none';
    });
}


















