// ------------ modal ---------------- //
function popModal(message, messageBody){
  $('#modal-parent').css('display', 'block');
  $('#modal-message').html(message);
  $('#modal-body').html(messageBody);
}

function handleModalClick(e){
  if (e.target.id == "modal-background"){
    hideModal();
  }
}

function hideModal(){
  $('#modal-parent').css('display', 'none');
}

function setupModal(){
  let message = '{{message}}';
  let messageBody = '{{ message_body | safe }}'
  if (message || messageBody){
    popModal(message, messageBody);
  }
  else {
    hideModal();
  }
}

function handleGagModal(e){
  popModal(
    'Wait! Do Not Buy The Book!',
    'Ben Shapiro is a hack. Please enjoy this AI trained on Ben\'s content instead. </p><p><b>Warning:this page contains offensive language and racist content, including racial slurs, because it was trained on Ben Shapiro.</b>',
  );
}

// ----------- simple routing ------------- //

if (!("onhashchange" in window)) {
  alert("You're running an old browser! This page probably will not work");
}

function goToPage(page_name) {
  window.location.hash = "#!"+ page_name;
}

function locationHasChanged(){
  var newPage = window.location.hash.substring(1);
  newPage = newPage.slice(1,);
  if (newPage){
    $(".content-container").css('display', 'none');
    $('#' + newPage).css('display', 'block');
  }
};

// ============ responsiveness ================== //
function responsiveTableIfAppropriate(){
  if (window.matchMedia('(max-width: 1480px)').matches) {
    var thArray = [];

    $('.main-table > thead > tr > th').each(function(){
      thArray.push($(this).text());
    })

    var trArray = []
    $('.main-table > tbody > tr').each(function(i){
      $(this).children().each(function(j){
        let text = $(this).html();
        $(this).html(
          thArray[j] + ': ' + text
        );
      })
    })
  }
}


// ============== handlers  =============== //

function handleQuizAnswer(e){
  var link = $(e.target);
  if (!link.is('a')){
    // child event
    if (link.parent().is('a')){
      link = link.parent();
    }
    else if (link.parent().parent().is('a')){
      link = link.parent().parent()
    }
    else {
      return
    }
  }
  e.preventDefault();

  $('body').css('opacity', .5);

  link = link.attr('href');
  $.get(link, function(data, textStatus){
    $('body').css('opacity', 1);
    if (textStatus==='success'){
      $('#is-tucker-link').attr('href', data.quiz.isTuckerLink);
      $('#is-tad-link').attr('href', data.quiz.isTadLink);
      $('#quiz-quote').html(data.quiz.quote);
      $('#is-tucker-prompt').html(
        data.quiz.person + ' said this. ' + data.quiz.isTuckerPrompt
      );
      $('#is-tad-prompt').html(
        data.quiz.AI + ' said this. ' + data.quiz.isTadPrompt
      );
      $("#who-said-it-prompt").html(data.quiz.prompt);

      var message = null;
      var messageBody = null
      if (data.user_message){
        message = 'Right';
        messageBody = 'Good work!';
      }
      else {
        message = 'Wrong';
        messageBody = 'Better luck next time!';
      }
      popModal(message, messageBody);
    }
    else{
      window.location.replace('/#!take-the-quiz')
    }
  });

}

function attachHandlers(){
  // modal
  $("#modal-parent").on('click', handleModalClick);
  $('#gag-modal').on('click', handleGagModal);

  // quiz
  $('.tuck-or-not-choice').on('click', handleQuizAnswer);

  window.onhashchange = locationHasChanged;

}

function setupPage(){
  setupModal();
  responsiveTableIfAppropriate();
  attachHandlers();
  locationHasChanged();
}

setupPage();
