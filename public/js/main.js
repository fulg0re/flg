$(document).ready(function(){
  $(".alert").hover(function(){
    $(this).hide();
  });

  $("#start-battle").click(function(){
    $.ajax({
      url: '/battle/start',
      method: 'get',
      success: function(result) {
        var data = JSON.parse(result);
        if (result.error !== undefined) {
          console.log(result.error);
        }else{
          var sentence = data.battleSentence;
          if ($('#battle-div').length != 0) {
            $("#battle-div").remove();
          }
          $("#main-content").append('<div id="battle-div"></div>');
          $("#battle-div").append(`<h4 id="battle-close" onclick="endBattle()">End battle</h4>`);
          $("#battle-div").append(`<h4 id="battle-text">${sentence}</h4>`);
          $("#battle-div").append('<input type="text" id="battle-input">');
          $("#battle-input").focus();
        }
      }
    });
  });
});

function endBattle() {
  if (confirm("Are you sure you want to leave the battle?")) {
    $("#battle-div").remove();
  }
};
