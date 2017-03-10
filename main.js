'use strict';

var game = {
  div_msg: undefined,
  size: 0.75,
  init: function() {
    console.log('init');
    game.div_msg = document.getElementById('div_message');
    document.getElementById('menu_game').onclick = function() {game.showTab('game');};
    document.getElementById('menu_stats').onclick = function() {game.showTab('stats');};
    document.getElementById('menu_about').onclick = function() {game.showTab('about');};
  },
  showTab: function(tabName) {
    ['game', 'stats', 'about'].forEach(function(v) {
      var e = document.getElementById('div_' + v);
      if (v === tabName) {
        e.style.display = 'flex';
      } else {
        e.style.display = 'none';
      }
    });
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
