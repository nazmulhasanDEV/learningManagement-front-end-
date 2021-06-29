$(function ($) {

  $.fn.makeDropdowns = function (options) {

    var settings = $.extend({},
    options);

    var dragAndDrop = this;
    var dragAndDropId = dragAndDrop.selector;
    var dropdowns = $(dragAndDrop).find(".dropdown");
    var drops = $(dragAndDrop).find('.wjec-drop');
    var numberOfChecks = 0;
    var dropdownText = [];
    $(drops).each(function () {

      dropdownText.push($(this).text());
    });

    $(dragAndDrop).
    find(".dropdown").
    each(function (index, el) {
      $.each(dropdownText, function (i, dropdownTextVal) {
        if (index == i) {
          $(el).append('<option value="correct">' + dropdownTextVal + "</option>");
        } else {
          $(el).append(
          '<option value="incorrect">' + dropdownTextVal + "</option>");

        }
      });

      var parent = $(this);
      var option = parent.children();
      while (option.length) {if (window.CP.shouldStopExecution(0)) break;
        parent.append(
        option.splice(Math.floor(Math.random() * option.length), 1)[0]);

      }window.CP.exitedLoop(0);
    });

    $(dragAndDrop).
    find(".dropdown").
    prepend(
    '<option selected="true" disabled="disabled">Select your option</option');


    var dropdownLength = $(dragAndDrop).find(".dropdown").length;
    var feedback = $(dragAndDrop).find(".feedback");

    function checkDropdown() {
      var numberCorrect = 0;

      numberOfChecks++;

      if (numberOfChecks <= 2) {
        for (i = 0; i <= dropdownLength; i++) {if (window.CP.shouldStopExecution(1)) break;
          if ($(".dropdown-" + i).val() == "correct") {
            numberCorrect++;
            console.log("You're right");
          } else if ($(".dropdown-" + i).val() == "incorrect") {
            console.log("You're wrong");
          }

          console.log('Answer ' + i + $(".dropdown-" + i).val());
        }window.CP.exitedLoop(1);
      }

      if (numberOfChecks == 3) {
        dragAndDrop.find('.checkDropdownBtn').hide();
        dragAndDrop.find('.correct-answers').show();
        dragAndDrop.find('.user-answers-header').show();
        dragAndDrop.find('.resetBtn').show();
        if ($(dropdowns).css('visibility') == 'visible') {
          dragAndDrop.find('.wjec-drag-and-drop-text').css({ "max-height": "150px", "overflow-y": "scroll" });
        }


      }

      return numberCorrect;
      return numberOfChecks;


    }

    function showFeedback(totalCorrect) {
      feedback.css("visibility", "visible");
      //all correct
      if (totalCorrect === dropdownLength) {
        feedback.find(".totalCorrect").text(totalCorrect);
        feedback.find(".dragTotal").text(dropdownLength);
        feedback.
        find(".feedback-allcorrect").
        siblings().
        hide();
        feedback.find(".feedback-allcorrect").show();
      } else {
        //any other score
        feedback.find(".totalCorrect").text(totalCorrect);
        feedback.find(".dragTotal").text(dropdownLength);
        feedback.
        find(".feedback-incorrect").
        siblings().
        hide();
        feedback.find(".feedback-incorrect").show();
      }
    }

    function resetItems() {
      feedback.css("visibility", "hidden");
    }

    dragAndDrop.on('click', '.checkAnswerBtn', function (event) {
      checkDropdown();
      var totalCorrect = checkDropdown();
      showFeedback(totalCorrect);
    });

    dragAndDrop.on('click', '.resetBtn', function (event) {
      resetItems();
      numberOfChecks = 0;
      dragAndDrop.find('.checkDropdownBtn').show();
      dragAndDrop.find('.correct-answers').hide();
      dragAndDrop.find('.user-answers-header').hide();
      dragAndDrop.find('.resetBtn').hide();
    });
  };

  $.fn.dragAndDropWords = function (options) {
    var settings = $.extend(
    {
      disableDraggableOnCorrect: true,
      changeBackgroundOnCorrect: true,
      inlineFeedback: true,
      returnOnIncorrect: true },

    options);


    var dragAndDrop = this;
    var dragAndDropId = dragAndDrop.selector;
    var drops = $(dragAndDrop).find('.wjec-drop');
    var dragsHolder = $(dragAndDrop).find('.drags-holder');
    var feedback = $(dragAndDrop).find('.feedback');
    var totalItems = drops.length;
    var numberOfChecks = 0;

    var $dragItemsClone;

    // INIT ACTIVITY


    initialDragAndDropSetUp();

    activateDragAndDrop();

    //FUNCTIONS

    function initialDragAndDropSetUp() {

      $.each(drops, function (index, element) {
        var dropText = $(element).text();
        $(element).data('correct-answer', dropText).
        text('');

        dragsHolder.append('<span class="wjec-drag">' + dropText + '<i class="fa fa-times"></i><i class="fa fa-check"></i></span>');
      });

      var maxWidth = getMaxWidth($(dragAndDrop).find('.wjec-drag'));
      drops.width(maxWidth + 30);

    }
    
    function getMaxWidth(drag) {
      var maxWidth = 0;
      $.each(drag, function (index, element) {
        if ($(element).width() >= maxWidth) {
          maxWidth = $(element).outerWidth();
        }
      });
      return maxWidth;
    }

    function activateDragAndDrop() {

      feedback.children().fadeOut();

      drops.droppable({
        hoverClass: 'drop-hover',
        scope: dragAndDropId,
        drop: handleDropEvent });


      dragsHolder.droppable({
        scope: dragAndDropId,
        drop: function (event, ui) {

          $(ui.draggable).appendTo($(this)).css({
            left: 0,
            top: 0 });


        } });



      //randomise the dom elements inside
      randomiseItems(dragsHolder);

      //create draggable element inside of li
      dragsHolder.children().draggable({
        revert: 'invalid',
        scope: dragAndDropId,
        containment: 'window',
        revertDuration: 200,
        snap: drops,
        stack: '.wjec-drag' });


    }

    function handleDropEvent(event, ui) {

      var thisDrop = $(this);
      var oldDrag = $(this).children();
      var thisDrag = $(ui.draggable[0]);

      var thisDragParent = $(ui.helper).parent();

      //if there is already an element on the drop then it will swap position with thisDragParent
      if (oldDrag.length > 0) {

        oldDrag.appendTo(thisDragParent).
        css({
          left: 0,
          top: 0 });


        oldDrag.removeClass("drag-correct drag-incorrect");
        oldDrag.find('.fa-check').hide();
        oldDrag.find('.fa-times').hide();
      }

      var thisDragOffset = thisDrag.offset();
      var thisDropOffset = thisDrop.offset();

      //animates the current draggable to the center of the drop
      thisDrag.appendTo(thisDrop).css({
        left: thisDragOffset.left - thisDropOffset.left - 10,
        top: thisDragOffset.top - thisDropOffset.top + 3 }).
      animate({
        left: 0,
        top: 0 },
      200);

    }

    //shuffle fisher-yates no repeat
    function shuffle(array) {
      for (var i = array.length - 1; i > 0; i--) {if (window.CP.shouldStopExecution(2)) break;
        var j = Math.floor(Math.random() * i);
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }window.CP.exitedLoop(2);
      return array;
    }

    /**
     * randomise items to be dragged
     * @param {DOM Element} - parent Element of items you want to shuffle
     */
    function randomiseItems(parentElement) {

      //make an deep clone of the items to be shuffled
      $dragItemsClone = parentElement.children().clone(true, true);

      shuffle($dragItemsClone);

      parentElement.html($dragItemsClone);
    }

    /**
     * reset drags and drops
     * @param {string} selector - parent ID of items you want to shuffle
     */
    function resetItems() {

      dragsHolder.append(drops.find('.wjec-drag'));

      dragsHolder.find('.wjec-drag').css({
        'left': "0",
        'top': "0" });


      drops.droppable("destroy");
      dragsHolder.children().draggable("destroy");

      // Revert drops and drags back to original colour
      if (settings.changeBackgroundOnCorrect) {
        $('.wjec-drop').removeClass('correct incorrect');
        $('.wjec-drag').removeClass('drag-correct drag-incorrect');
      }
      // Hide inline feedback
      if (settings.inlineFeedback) {
        $('.wjec-drag').find('.fa-check').hide();
        $('.wjec-drag').find('.fa-times').hide();
      }

      activateDragAndDrop();

    }

    /*
    * checks the current text against the data correct-answer
    @param {DOM Elements} drops
    @returns {Number} numberCorrect
    */
    function checkAnswers(drops) {
      var numberCorrect = 0;

      drops.each(function (index, element) {

        var currentAns = $(element).children().text();

        var correctAns = $(element).data('correct-answer');

        if (currentAns === correctAns) {
          //add to total
          numberCorrect++;
        }

      });

      numberOfChecks++;

      if (numberOfChecks >= 2) {
        drops.each(function (index, element) {

          var currentAns = $(element).children().text();

          var correctAns = $(element).data('correct-answer');

          if (currentAns === correctAns) {
            // Change colour of drop and drag background if correct
            if (settings.changeBackgroundOnCorrect)
            {
              $(element).addClass('correct');
              $(element).find('.wjec-drag').addClass('drag-correct');
            }
            // If correct draggable and droppable are disabled
            if (settings.disableDraggableOnCorrect)
            {
              $(element).droppable('disable');
              $(element).find('.wjec-drag').draggable('disable');
            }
            // Show tick icon if correct
            if (settings.inlineFeedback) {
              $(element).find('.wjec-drag').find('.fa-check').show();
              $(element).find('.wjec-drag').find('.fa-times').hide();
            }
          } else
          {
            // Change colour of drop and drag background if correct
            if (settings.changeBackgroundOnCorrect)
            {
              $(element).addClass('incorrect');
              $(element).find('.wjec-drag').addClass('drag-incorrect');
            }
            // Show cross icon if incorrect
            if (settings.inlineFeedback) {
              $(element).find('.wjec-drag').find('.fa-check').hide();
              $(element).find('.wjec-drag').find('.fa-times').show();
            }
            if (settings.returnOnIncorrect) {
              dragsHolder.append($(element).find('.wjec-drag'));
            }
          }

        });
      }

      if (numberOfChecks == 3) {
        dragAndDrop.find('.checkAnswerBtn').hide();
        dragsHolder.hide();
        dragAndDrop.find('.wjec-drag-and-drop-text').removeClass('col-md-12').addClass('col-md-6');
        dragAndDrop.find('.correct-answers').show();
        dragAndDrop.find('.user-answers-header').show();
        dragAndDrop.find('.resetBtn').show();
      }

      return numberCorrect;
      return numberOfChecks;
    }

    /**
     * show feedback divs
     * @param {Number} totalCorrect
     */
    function showFeedback(totalCorrect) {
      feedback.css('visibility', 'visible');
      //all correct
      if (totalCorrect === totalItems) {
        feedback.find('.totalCorrect').text(totalCorrect);
        feedback.find('.dragTotal').text(totalItems);
        feedback.find('.feedback-allcorrect').siblings().hide();
        feedback.find('.feedback-allcorrect').show();
      }
      //any other score
      else {
          feedback.find('.totalCorrect').text(totalCorrect);
          feedback.find('.dragTotal').text(totalItems);
          feedback.find('.feedback-incorrect').siblings().hide();
          feedback.find('.feedback-incorrect').show();
        }
    }


    //EVENT HANDLERS

    dragAndDrop.on('click', '.checkAnswerBtn', function (event) {
      event.preventDefault();
      var totalCorrect = checkAnswers(drops);
    //   var totalCorrect = checkDropdown();
      showFeedback(totalCorrect);
    });

    dragAndDrop.on('click', '.resetBtn', function (event) {
      event.preventDefault();
      resetItems();
      numberOfChecks = 0;
      dragAndDrop.find('.checkAnswerBtn').show();
      dragsHolder.show();
      dragAndDrop.find('.wjec-drag-and-drop-text').addClass('col-md-12').removeClass('col-md-6');
      dragAndDrop.find('.correct-answers').hide();
      dragAndDrop.find('.user-answers-header').hide();
      dragAndDrop.find('.resetBtn').hide();
    });
  };

  /*
  * Background colour of drag and drop will change if correct
  */

  $('#dragAndDrop1').makeDropdowns();

  $('#dragAndDrop1').dragAndDropWords({
    disableDraggableOnCorrect: false,
    returnOnIncorrect: false });

});
