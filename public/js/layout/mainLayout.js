$(document).ready(function(){
  var socket = io('http://127.0.0.1:3000/');
  socket.emit("addUser", {"username": $.cookie('username')});

  $("#start-battle").click(function(){
    socket.emit("startBattrle", {"username": $.cookie('username')});
  });

  $("#stop-battle").click(function(){
    socket.emit("stopBattrle", {"username": $.cookie('username')});
  });

  socket.on('battleStarted', function(data){
    url = "/battle/progress";
    $(location).attr("href", url);
  });


  
  // $("#start-battle").click(function(){
  //   var socket = io('http://127.0.0.1:3000/');

  //   $.ajax({
  //     url: '/battle/start',
  //     method: 'get',
  //     success: function(result) {
  //       var data = JSON.parse(result);
  //       if (result.error !== undefined) {
  //         console.log(result.error);
  //       }else{
  //         localStorage.sentence = data.battleSentence;

  //         socket.emit("add-user", {"username": $.cookie('username')});

  //         if ($('#battle-div').length != 0) {
  //           $("#battle-div").remove();
  //         }

  //         $("#main-content").append('<div id="battle-div"></div>');
  //         $("#battle-div").append(`<h4 id="battle-close" onclick="endBattle()">End battle</h4>`);
  //         $("#battle-div").append('<div id="battle-div-content"></div>');

  //         $.each(localStorage.sentence.split(''), function(key, char){
  //           if (char == ' ') {
  //             $("#battle-div-content").append(`<p class="battle-text">&#160</p>`);
  //           } else {
  //             $("#battle-div-content").append(`<p class="battle-text">${char}</p>`);
  //           }
  //         });
  //         $("#battle-div").append('<input id="battle-input" type="text" onkeyup="batleInProgress()">');
  //         $("#battle-input").focus();
  //       }
  //     }
  //   });
  // });
});

// function endBattle() {
//   if (confirm("Are you sure you want to leave the battle?")) {
//     $("#battle-div").remove();
//   }
// };

// function batleInProgress() {
//   var sentence = localStorage.sentence;
//   var sentenceSplited = sentence.split('');
//   var inputText = $('#battle-input').val();
//   var inputTextSplited = inputText.split('');

//   var goodCount = 0;
//   for (var i = 0; i < inputTextSplited.length; i++) {
//     if (inputTextSplited[i] == sentenceSplited[i]) {
//       goodCount++;
//     } else {
//       break;
//     }
//   }

//   var result = sentenceSplited.length - goodCount + 1;

//   $(`.battle-text:nth-last-child(1n+${result})`).css("background-color", "green");
//   $(`.battle-text:nth-last-child(-1n+${result - 1})`).css("background-color", "red");
// };