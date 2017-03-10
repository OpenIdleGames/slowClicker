'use strict';

var game = {
  div_msg: undefined,
  div_size: undefined,
  div_score: undefined,
  size: 40,
  score: 0,
  init: function() {
    console.log('init');
    game.div_msg = document.getElementById('div_message');
    game.div_size = document.getElementById('div_turtlePlusMessage');
    game.div_score = document.getElementById('div_score');
    document.getElementById('menu_game').onclick = function() {game.showTab('game');};
    document.getElementById('menu_stats').onclick = function() {game.showTab('stats');};
    document.getElementById('menu_about').onclick = function() {game.showTab('about');};
    document.getElementById('img_turtle').onclick = game.click;
    
    game.msg(['Hello!', 'I\'m Louis.']);
    
    setInterval(game.update, 250);
  },
  changeSize: function(size) {
    game.div_size.style.height = size + 'px';
    game.size = size;
  },
  showScore: function() {
    game.div_score.innerHTML = 'Score: ' + game.score;
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
  click: function() {
    console.log('click');
  },
  update: function() {
    game.showScore();
  }
};

game.init();
