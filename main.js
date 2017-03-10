'use strict';

var game = {
  div_msg: undefined,
  div_size: undefined,
  div_score: undefined,
  img_turtle: undefined,
  div_stats_data: undefined,
  size: 40,
  score: 0,
  clickSize: 1,
  totalClicks: 0,
  autoCount: 0,
  foodQuality: 1,
  state: 'start',
  startTime: undefined,
  init: function() {
    console.log('init');
    game.startTime = Date.now();
    game.div_msg = document.getElementById('div_message');
    game.div_size = document.getElementById('div_turtlePlusMessage');
    game.div_score = document.getElementById('div_score');
    game.img_turtle = document.getElementById('img_turtle');
    game.div_stats_data = document.getElementById('div_stats_data');
    document.getElementById('menu_game').onclick = function() {game.showTab('game');};
    document.getElementById('menu_stats').onclick = function() {game.showTab('stats');};
    document.getElementById('menu_about').onclick = function() {game.showTab('about');};
    game.img_turtle.onclick = game.click;
    game.img_turtle.onmousedown = game.mouseDown;
    game.img_turtle.onmouseup = game.mouseUp;
    
    setTimeout(function() {
      game.msg(['Hello!', 'I\'m Louis.', 'Welcome to my game.', 'Click on me to give me food.']);
    }, 2000);
    
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
    game.score += game.clickSize * game.foodQuality;
    game.totalClicks += 1;
    game.showScore();
  },
  mouseDown: function() {
    game.img_turtle.style.transform = 'scale(1.1,1.1)';
  },
  mouseUp: function() {
    game.img_turtle.style.transform = '';
  },
  updateStats: function() {
    var curTime = Date.now();
    var playSeconds = Math.round((curTime - game.startTime) / 1000);
    game.div_stats_data.innerHTML = 'Score: ' + game.score + '<br>Clicks: ' + game.totalClicks + '<br>Play time: ' + playSeconds + ' seconds';
  },
  update: function() {
    game.score += game.autoCount * game.foodQuality;
    game.logic();
    game.updateStats();
    game.showScore();
    game.changeSize(40 + Math.pow(game.score,0.75));
  },
  logic: function() {
    switch (game.state) {
      case 'start':
        if (game.score >= 10) {
          game.msg(['You\'ve fed me 10 times. Thanks!', 'Try purchasing the first upgrade.']);
        }
        break;        
    }
  }
};

game.init();
