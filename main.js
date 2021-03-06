'use strict';

var game = {
  div_msg: undefined,
  div_size: undefined,
  div_score: undefined,
  img_turtle: undefined,
  div_stats_data: undefined,
  size: 40,
  score: 0,
  clickSize: 0,
  totalClicks: 0,
  autoCount: 0,
  foodQuality: 1,
  state: 'start',
  startTime: undefined,
  msgQueue: [],
  msgInProgress: false,
  init: function() {
    console.log('init');
    game.startTime = Date.now();
    game.div_msg = document.getElementById('div_message');
    game.div_size = document.getElementById('div_turtlePlusMessage');
    game.div_score = document.getElementById('div_score');
    game.img_turtle = document.getElementById('img_turtle');
    game.div_stats_data = document.getElementById('div_stats_data');
    document.getElementById('body').ontouchend = function(e) {e.preventDefault();};
    document.getElementById('menu_game').onclick = function() {game.showTab('game');};
    document.getElementById('menu_stats').onclick = function() {game.showTab('stats');};
    document.getElementById('menu_about').onclick = function() {game.showTab('about');};
    document.getElementById('div_fpc').onclick = game.buyFPCUpgrade;
    document.getElementById('div_af').onclick = game.buyAFUpgrade;
    document.getElementById('div_bf').onclick = game.buyBFUpgrade;
    
    setTimeout(function() {
      game.addMsgs(['Hello!', 
        'I\'m Louis and I\'m 10 years old.', 
        'Welcome to my game.', 
        function() {game.clickSize = 1; 
          game.img_turtle.onclick = game.click;
          document.getElementById('body').ontouchend = function(e) {e.preventDefault(); e.target.click()};
          game.img_turtle.ontouchstart = game.mouseDown;
          game.img_turtle.ontouchend = game.mouseUp;
          game.img_turtle.onmousedown = game.mouseDown;
          game.img_turtle.onmouseup = game.mouseUp;
        },
        'Click on me to give me food.', 
        'But take it slow, this is my first game.',
        ]);
    }, 1500);
    
    setInterval(game.update, 250);
  },
  buyFPCUpgrade: function() {
    game.clickSize = 5;
    document.getElementById('div_fpc').className = 'menu_left_disable';
    game.score -= 50;
  },
  buyAFUpgrade: function() {
    game.autoCount = 1;
    document.getElementById('div_af').className = 'menu_left_disable';
    game.score -= 500;
  },
  buyBFUpgrade: function() {
    game.foodQuality = 5;
    document.getElementById('div_bf').className = 'menu_left_disable';
    game.score -= 1000;
  },
  changeSize: function(size) {
    game.div_size.style.height = size + 'px';
    game.size = size;
  },
  showScore: function() {
    if (game.state !== 'done') {
      game.div_score.innerHTML = 'Food: ' + game.score;
    } else {
      game.div_score.innerHTML = '';
    }
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
    var waitTime = Math.max(text.length * 2500 / 25, 2000);
    game.div_msg.innerHTML = text;
    game.div_msg.style.transition = 'opacity 100ms linear';
    game.div_msg.style.opacity = 1;
    setTimeout(function(){
      game.div_msg.style.transition = 'opacity 1000ms linear';
      game.div_msg.style.opacity = 0;
      setTimeout(function(){
        game.msgInProgress = false;
      },1000);
    }, waitTime);
  },
  addMsgs: function(msgs) {
    if (typeof msgs === 'object') {
      game.msgQueue = game.msgQueue.concat(msgs);
    } else {
      game.msgQueue.push(msgs);
    }     
  },
  processMsgs: function() {
    var newMsg;
    if (game.msgInProgress || (game.msgQueue.length == 0)) {
      return;
    } else {
      newMsg = game.msgQueue.shift();
      if (typeof newMsg === 'function') {
        newMsg();
      } else {
        game.msgInProgress = true;
        game.msg(newMsg);
      }
    }
  },
  click: function() {
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
    if (game.state !== 'done') {
      var curTime = Date.now();
      var playSeconds = Math.round((curTime - game.startTime) / 1000);
      game.div_stats_data.innerHTML = 'Food: ' + game.score + '<br>Clicks: ' + game.totalClicks + '<br>Play time: ' + playSeconds + ' seconds';
    } else {
      game.div_stats_data.innerHTML = '';
    }
  },
  update: function() {
    game.score += game.autoCount * game.foodQuality;
    game.logic();
    game.updateStats();
    game.showScore();
    game.changeSize(40 + Math.pow(game.score,0.75));
    game.processMsgs();
  },
  logic: function() {
    switch (game.state) {
      case 'start':
        if (game.score >= 50) {
          game.addMsgs(['You\'ve fed me 50 times. Thanks!', 'I\'ll enable the first upgrade.',
          function() {
            document.getElementById('div_fpc').className = 'menu_left';
          }]);          
          game.state = 'wait_for_first_upgrade';
        }
        break;        
      case 'wait_for_first_upgrade':
        if (game.clickSize >= 5) {
          game.addMsgs(['Now you can feed me faster.', 'That\'s great because I\'m really hungry!']);
          game.state = 'wait big 1';
        }
        break;
      case 'wait big 1':
        if (game.score >= 100) {
          game.addMsgs('All this food is making me grow fast.');
          game.state = 'wait big 2';          
        }
        break;
      case 'wait big 2':
        if (game.score >= 500) {
          game.addMsgs(['Wow! I\'m getting a little too big.', 
          'I\'ll enable another upgrade so you can spend some food and I can shrink back down.',
          function() {
            document.getElementById('div_af').className = 'menu_left';
          }
          ]);
          game.state = 'wait for second upgrade';
        }
        break;
      case 'wait for second upgrade':
        if (game.autoCount >= 1) {
          game.addMsgs(['Whew, that feels better.', 'I\'ll feed myself now.']);
          game.state = 'wait big 3';
        }
        break;
      case 'wait big 3':
        if (game.score >= 1000) {
          game.addMsgs(['Oh no! I\'m getting way too big.',
          'You weren\'t feeding me too were you?',
          'I\'ve got one more upgrade you can buy to help me shrink again.',
          function() {
            document.getElementById('div_bf').className = 'menu_left';
          }
          ]);
          game.state = 'wait for third upgrade';
        }
        break;
      case 'wait for third upgrade':
        if (game.foodQuality >= 5) {
          game.addMsgs(['Ahhhh. Feeling better again.', 'That was my last upgrade though so we better be careful.']);
          game.state = 'wait big 4';
        }
        break;
      case 'wait big 4':
        if (game.score >= 2000) {
          game.addMsgs(['This is not good.', 'That was the last upgrade I had.']);
          game.state = 'wait big 5';
        }
        break;
      case 'wait big 5':
        if (game.score >= 5000) {
          game.addMsgs([function() {
            game.img_turtle.src = './turtleflop_sick1.png';
          },'I don\'t feel so good.']);
          game.state = 'wait big 6';
        }
        break;
      case 'wait big 6':
        if (game.score >= 9000) {
          game.img_turtle.src = './turtleflop_sick2.png';
          game.addMsgs(['OWIEEEEE!!!!!!']);
          game.state = 'wait big final';
        }
        break;
      case 'wait big final':
        if (game.score >= 10000) {
          game.state = 'end';
        }
        break;
      case 'end':
        game.clickSize = 0;
        game.autoCount = 0;
        game.addMsgs(['BURRRRRRRRP!!!!!',
          function() {
            game.img_turtle.style.transformOrigin = '0% 0%';
            game.img_turtle.style.transition = 'transform 1000ms linear';
            game.img_turtle.style.transform = 'scale(0.1)';
            setTimeout(function() {
              game.img_turtle.style.transition = 'none';
              game.img_turtle.style.transform = 'none';

              game.score = 240;
              game.changeSize(104); 
              game.img_turtle.src = './turtleflop.png';             
              game.addMsgs([
                'Whew! I feel so much better!', 'I don\'t think I want to play this any more.', 'Bye!',
                function() {
                  game.img_turtle.style.transition = 'opacity 2000ms linear'
                  game.img_turtle.style.opacity = 0;
                  setTimeout(function() {
                    document.getElementById('div_stats_text').innerHTML = 'The game is over.';
                    document.getElementById('img_louis_stats').style.visibility = 'hidden';
                    document.getElementById('div_about').innerHTML = 'Sorry, I don\'t want to play this game any more.';
                  }
                  , 2000);
                }
              ]);
            }
            ,1000);
          }
        ]);
        game.state = 'done';
        break;
      case 'done':

        break;
    }
  }
};

game.init();
