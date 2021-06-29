// ============= IMAGE HOTSPOT ==============
disableForm() //disable spots setting by default
let file;
const dropArea = document.querySelector('.drop-area')
dragText = dropArea.querySelector('header')
button = dropArea.querySelector('button')
input = dropArea.querySelector('input')

// transferred input:file task to "browse file" button 
button.onclick = () => {
    input.click();
}

// file input 
input.addEventListener('change', function (event) {
    if (!$('.selected').length) {
        file = this.files[0];
        showFile();
        drawSpots(event);
        $(".drop-area").addClass('active');
    }
});

// if user drag file over drag area
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    $('.drop-area').addClass('active');
    dragText.textContent = "Release to Upload File";
});

// if user leave dragged file from dragarea 
dropArea.addEventListener('dragleave', () => {
    $('.drop-area').removeClass('active');
    dragText.textContent = "Drag and Drop File to Upload";
});

// if user drop file on dropArea 
dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    file = event.dataTransfer.files[0];//if user select multiple files then select first of them
    showFile();
    drawSpots(event);
});

var imgTag;
function showFile() {
    let fileType = file.type;
    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png']; // image extension validations

    if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader(); //passing user file source in fileurl 
        fileReader.onload = () => {
            let fileURL = fileReader.result;
            imgTag = `<img src='${fileURL}'>` //creating an image tag and passing user slected file source inside src
            dropArea.innerHTML = imgTag; //putting img in drop area
        }
        fileReader.readAsDataURL(file)
    }
    else {
        alert('this is not an image file')
        $('.drop-area').removeClass('active');
    }
}
// draw spots 
var spotWrapperArr;
let id = 0;
function drawSpots(event) {
    id++;
    let spotWrapper = document.createElement('div');
    spotWrapper.setAttribute('id', 'spotWrapper-' + id);
    spotWrapper.setAttribute('class', 'spotWrapper visible');
    let x = event.pageX - $(".image").offset().left;
    let y = event.pageY - $(".image").offset().top;
    spotWrapper.style.left = x - 7 + 'px'
    spotWrapper.style.top = y - 7 + 'px'
    $('.image').append(spotWrapper);

    $(spotWrapper).html(`<div id='spot-${id}' class ='t_hotspot red'><input type='hidden' value='' id='input-${id}' class='spotInp'></div>\
        <div id='tooltip-${id}' class='toolTip right width-auto'></div>`);

    spotWrapperArr = Array.from($('.spotWrapper'))
};


// unable form for setting 
function enableForm() {
    $('form *').prop('disabled', false)
};

// disable form when no hotspot is selected 
function disableForm() {
    $('form *').prop('disabled', true)
};

// delete a spot 
$('#t_deleteSpot').on('click', () => {
    let selected = document.querySelector('.selected');
    selected.parentElement.style.display = 'none';
});


// select spot shape 
$('#t_spotType').on('change', () => {
    let selected = document.querySelector('.selected');
    selected.classList.remove('circle', 'square', 'circle-outline', 'square-outline');
    selected.classList.add(`${$('#t_spotType').val()}`);
});

// select spot size 
$('#t_spotSize').on('change', () => {
    let selected = document.querySelector('.selected');
    selected.classList.remove(`small`, 'medium', 'large')
    selected.classList.add(`${$('#t_spotSize').val()}`)
});

// select spot color 
$('#t_spotColor').on('change', () => {
    let selected = document.querySelector('.selected');
    selected.classList.remove(`red`, 'green', 'blue', 'purple', 'pink', 'orange')
    selected.classList.add(`${$('#t_spotColor').val()}`)
});

// set tooltip width
$("#t_toolTipWidth").on('input', () => {
    var tooltip = document.querySelector('.selected').nextElementSibling;
    tooltip.classList.remove('width-auto')
    tooltip.style.width = $('#t_toolTipWidth').val() + "px";
});

// set tooltip width
$("#t_toolTipWidthAuto").on('click', () => {
    var tooltip = document.querySelector('.selected').nextElementSibling;
    tooltip.classList.add('width-auto')
});

// selecte tooltip position 
$("#t_popupPosition").on('change', () => {
    var tooltip = document.querySelector('.selected').nextElementSibling;
    tooltip.classList.remove('left', 'right', 'bottom', 'top')
    tooltip.classList.add($('#t_popupPosition').val());
});

// hotspot name 
let tContent;
$("#t_content").on('input', (event) => {
    let tooltip = document.querySelector('.selected').nextElementSibling
    let spotInp = document.querySelector('.selected').childNodes[0];
    tContent = $('#t_content').val()
    tooltip.innerHTML = tContent
    spotInp.value = tContent
});

let wordArr = [];
$("#done-btn").on('click', () => {
    $("#t_content").val("")
    let selected = document.querySelector('.selected');
    let newWord = selected.firstElementChild.value
    if (wordArr.length > 0) {
        $('#take-quiz-btn').removeAttr('disabled');
    }
    if (newWord != "" && newWord != " ") {
        wordArr.push(newWord);
    }
});

// fetching last questWord of question string
function getLastWord(questionString) {
    let n = questionString.split(" ");
    return n[n.length - 1];
}

// take quiz 
let score = 0;
let questionNo = 0;

$('.image').on('mousedown', (event) => {
    if ($(event.target).hasClass('t_hotspot')) {
        id = event.target.getAttribute('id').slice(-1)
        $(`#tooltip-${id}`).toggle();
        $('.t_hotspot').removeClass('selected');
        $(`#spot-${id}`).addClass('selected');
        enableForm();

        let draggable = $(".spotWrapper").draggabilly();
    }

    else if ($(event.target).hasClass('btn')) {
        input.click();
    }
    else if ($(event.target).hasClass('quiz-circle')) {
        let spotInp = event.target.childNodes[0];
        let spotWord = spotInp.value;
        let quest = document.getElementById('quiz_question').textContent;
        let questWord = getLastWord(quest)
        if (questionNo == wordArr.length) {
            $('#quiz_question').hide();
            if (spotWord === questWord) {
                score++
            };
            swal("Done!", `You scored ${score} out of ${wordArr.length}`, "success");
            $('.image').css('pointer-events', 'none');
        }
        else if (spotWord === questWord) {
            $("#toast").attr("class", "success-toast");
            $('#toast').animate({"bottom":"20vh"})
            $('#toast').animate({"bottom":"18vh"})
            $('#toast').animate({"bottom":"20vh"})
            $('#toast').animate({"bottom":"-10vh"})
            $('#toast').text('Correct!');
            score++;
        }
        else {
            $("#toast").attr("class", "error-toast");
            $('#toast').animate({"bottom":"20vh"})
            $('#toast').animate({"bottom":"18vh"})
            $('#toast').animate({"bottom":"20vh"})
            $('#toast').animate({"bottom":"-10vh"})
            $('#toast').text('incorrect!');
        };

        $('#quiz_question').text('Mark the ' + wordArr[questionNo]);
        questionNo++;
    }

    else if (event.target.hasAttribute('src')) {
        drawSpots(event);
    };
});

$("#take-quiz-btn").on('click', () => {
    $('.properties, .toolTip, #take-quiz-btn').hide();
    $('#quiz_question').show();
    $('#quiz_question').text('Mark the ' + wordArr[questionNo]);
    $('.red').css("background-color", "transparent");
    $('.toolTip').css('visibility', 'hidden');
    $('.t_hotspot').attr("class", "red quiz-circle");
    questionNo++;
    let draggable = $(".spotWrapper").draggabilly();
    draggable.draggabilly('disable')
});






