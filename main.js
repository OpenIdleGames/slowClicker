'use strict';

var game = {
  div_msg: undefined,
  init: function() {
    console.log('init');
    game.div_msg = document.getElementById('div_message');
  },
  msg: function(text) {
    var waitTime = Math.max(text.length * 3000 / 25, 2000);
    var displayText;
    if (typeof text === 'object') {
      displayText = text[0];
      text.shift();
    } else {
      displayText = text;
    }
    game.div_msg.innerHTML = displayText;
    game.div_msg.style.transition = 'opacity 100ms linear';
    game.div_msg.style.opacity = 1;
    setTimeout(function(){
      game.div_msg.style.transition = 'opacity 1000ms linear';
      game.div_msg.style.opacity = 0;
      if (typeof text === 'object' && text.length > 0) {
        setTimeout(function(){
          game.msg(text);
        },1000);
      }
    }, waitTime);
  },
};

game.init();
