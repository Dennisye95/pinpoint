var state = {}

$(document).ready(() => {
  initializeSettings();
  resetGame();
  $('.slider').change(inputChange);
  $('.settings').submit(() => {
    resetGame();
    showBoard();
  });
  $('.start').click(() => {
    $('.start').hide();
    startGame();
  })
});

// Core functions
function showBoard() {
  resetGame();
  $('.settings').hide();
  $('.game').show();
  state.interval = 10000 / (state.level * state.size);
}

function startGame() {
  state.gameInterval = setInterval(move, state.interval);
  state.scoreInterval = setInterval(updateStats, 1000);
  trigger(hit);
}

function createGrid() {
  for (var i=0; i<state.size*state.size; i++) {
    $('.board').append('<div class="block"></div>');
  }
  $('.board .block').addClass('block-style');
  addDot();
  highlight();
}

function resetGame() {
  clearInterval(state.gameInterval);
  clearInterval(state.scoreInterval);
  state.gameInterval = null;
  state.scoreInterval = null;
  state.size = Number($('#size').val());
  state.level = Number($('#level').val());
  state.colors = randomColors();
  cssClasses();
  state.current = {
    x: Math.floor(Math.random() * state.size) + 1,
    y: Math.floor(Math.random() * state.size) + 1,
  }
  state.orientation = Math.floor(Math.random() * 2);
  state.direction = 1;
  state.score = 0;
  state.moves = 0;
  state.time = 0;
  removeTriggers();
  $('.board .block').remove();
  createGrid();
}

function addDot() {
  state.target = {
    x: Math.floor(Math.random() * state.size) + 1,
    y: Math.floor(Math.random() * state.size) + 1
  };
  var index = getIndex(state.target.x, state.target.y);
  $('.board .block').empty();
  $(`.board .block:nth-child(${index})`).html('<i class="icon target fas fa-dot-circle"></i>');
  $('.board .block .icon').addClass('icon-style');
}

function hit() {
  state.moves += 1;
  if (state.current.x === state.target.x && state.current.y === state.target.y) {
    state.score += 1;
    addDot();
  }
  state.orientation = !state.orientation;
  updateStats(updateTime=false);
}

function move() {
  state.time += state.interval;
  if (state.orientation) {
    if (state.current.x >= state.size) {
      state.direction = -1;
    } else if (state.current.x <= 1) {
      state.direction = 1;
    }
    state.current.x += state.direction;
  } else {
    if (state.current.y >= state.size) {
      state.direction = -1;
    } else if (state.current.y <= 1) {
      state.direction = 1;
    }
    state.current.y += state.direction;
  }
  highlight();
}

function highlight() {
  $('.board .block').removeClass('dim');
  $('.board .block').removeClass('highlight');
  for (var i = 1; i<=state.size; i++) {
    if (state.orientation) {
      var index = getIndex(i, state.current.y);
      if (index == getIndex() && index != getIndex(state.target.x, state.target.y)) {
        $(`.board .block:nth-child(${index})`).addClass('highlight');
      } else {
        $(`.board .block:nth-child(${index})`).addClass('dim');
      }
    } else {
      var index = getIndex(state.current.x, i);
      if (index == getIndex() && index != getIndex(state.target.x, state.target.y)) {
        $(`.board .block:nth-child(${index})`).addClass('highlight');
      } else {
        $(`.board .block:nth-child(${index})`).addClass('dim');
      }
    }
  }
  if (getIndex() == getIndex(state.target.x, state.target.y)) {
    $('.block .target').removeClass('fas fa-dot-circle');
    $('.block .target').addClass('far fa-star');
  } else {
    $('.block .target').removeClass('far fa-star');
    $('.block .target').addClass('fas fa-dot-circle');
  }
}

// Helpers
function initializeSettings() {
  var size = localStorage.getItem('size') || 5;
  var level = localStorage.getItem('level') || 5;
  $('#size').val(size);
  $('#level').val(level);
  $('label[for=size]').text('SIZE: ' + size);
  $('label[for=level]').text('LEVEL: ' + level);
}

function inputChange(event) {
  var value = event.target.value;
  var id = event.target.id;
  localStorage.setItem(id, value);
  $(`label[for=${id}]`).text(`${id.toUpperCase()}: ${value}`);
}

function trigger(callback) {
  $('.board').click(callback);
  $('body').keyup((e) => {
      if (e.keyCode == 32) {
        callback();
      }
  });
}

function removeTriggers() {
  $('.board').off();
  $('body').off();
}

function getIndex(x=state.current.x, y=state.current.y) {
  return (y-1) * state.size + x;
}

function randomColors() {
  var colors = []
  for (var i=0; i<3; i++) {
    colors.push(Math.floor(Math.random() * 256));
  };
  var dim = colors.map((color) => {
    return color * 0.5;
  })
  var secondary = colors.map((color) => {
    return 255 - color;
  });

  var primaryColor = colorString(colors);
  var dimColor = colorString(dim);
  var secondaryColor = colorString(secondary);
  return [primaryColor, dimColor, secondaryColor];
}

function colorString(colors) {
  return "rgb(" + colors.join(", ") + ")";
}

// Utils
function updateStats(updateTime=true) {
  $('.stats > #score').text(state.score);
  $('.stats > #moves').text(state.moves);
  if (updateTime) {
    $('.stats > #time').text(String(state.time/1000).split('.')[0] + ' s');
  }
}

function cssClasses() {
  var margin = 1 - (Math.floor((state.size - 1) / 5) - 1) * 0.25;
  var marginString = margin + '%';
  var width = 100/state.size - 2*margin;
  var widthString = String(width).substr(0,5) + '%';
  var fontSize = String(width/3.2)+'em';

  var blockStyle = document.createElement('style');
  blockStyle.type = 'text/css';
  blockStyle.innerHTML = `.block-style {
    margin: ${marginString};
    background-color: ${state.colors[0]};
    width: ${widthString};
    padding-bottom: ${widthString};
  }`;
  document.getElementsByTagName('head')[0].appendChild(blockStyle);

  var dimStyle = document.createElement('style');
  dimStyle.type = 'text/css';
  dimStyle.innerHTML = `.dim {
    background-color: ${state.colors[1]};
  }`;
  document.getElementsByTagName('head')[0].appendChild(dimStyle);

  var highlightStyle = document.createElement('style');
  highlightStyle.type = 'text/css';
  highlightStyle.innerHTML = `.highlight {
    background-color: ${state.colors[2]};
  }`;
  document.getElementsByTagName('head')[0].appendChild(highlightStyle);

  var iconStyle = document.createElement('style');
  iconStyle.type = 'text/css';
  iconStyle.innerHTML = `.icon-style {
    color: ${state.colors[2]};
    font-size: ${fontSize};
  }`
  document.getElementsByTagName('head')[0].appendChild(iconStyle);
}
