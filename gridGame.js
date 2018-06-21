var state = {}

$(document).ready(() => {
  state.size = 10;
  state.level = 10;
  state.colors = randomColors();
  cssClasses();
  state.current = {
    x: Math.floor(state.size/2) + 1,
    y: Math.floor(state.size/2) + 1
  }
  state.orientation = true;
  state.direction = 1;
  state.score = 0;
  startGame();
});

// Core functions
function startGame() {
  createGrid();
  var interval = (1/state.level) * state.size * 100;
  setInterval(move, interval);
  $('.game').click(hit);
  $('body').keyup((e) => {
      if (e.keyCode == 32) {
        hit();
      }
  });
}

function createGrid() {
  for (var i=0; i<state.size*state.size; i++) {
    $('.game').append('<div class="block"></div>');
  }
  $('.game .block').addClass('block-color');
  addDot();
  highlight();
}

function addDot() {
  state.target = {
    x: Math.floor(Math.random() * state.size) + 1,
    y: Math.floor(Math.random() * state.size) + 1
  };
  var index = getIndex(state.target.x, state.target.y);
  $('.game .block').empty();
  $(`.game .block:nth-child(${index})`).html('<i class="icon target fas fa-dot-circle"></i>');
  $('.game .block .icon').addClass('icon-style');
}

function hit() {
  if (state.current.x === state.target.x && state.current.y === state.target.y) {
    console.log('success');
    state.score += 1;
    addDot();
  }
  state.orientation = !state.orientation;
}

function move() {
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
  console.log(state.current);
  $('.game .block').removeClass('highlight');
  for (var i = 1; i<=state.size; i++) {
    if (state.orientation) {
      var index = getIndex(i, state.current.y);
      if (index != getIndex() && index != getIndex(state.target.x, state.target.y)) {
        $(`.game .block:nth-child(${index})`).addClass('highlight')
      }
    } else {
      var index = getIndex(state.current.x, i);
      if (index != getIndex() && index != getIndex(state.target.x, state.target.y)) {
        $(`.game .block:nth-child(${index})`).addClass('highlight')
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
function getIndex(x=state.current.x, y=state.current.y) {
  return (y-1) * state.size + x;
}

function randomColors() {
  var colors = []
  for (var i=0; i<3; i++) {
    colors.push(Math.floor(Math.random() * 256));
  };
  var secondary = colors.map((color) => {
    return 255 - color;
  });

  var primaryColor = colorString(colors);
  var secondaryColor = colorString(secondary);
  return [primaryColor, secondaryColor];
}

function colorString(colors) {
  return "rgb(" + colors.join(", ") + ")";
}

// Utils
function cssClasses() {
  var width = 100/state.size - 2;
  var widthString = String(width).substr(0,5) + '%';
  var fontSize = String(width*35)+'%';

  var blockStyle = document.createElement('style');
  blockStyle.type = 'text/css';
  blockStyle.innerHTML = `.block-color {
    background-color: ${state.colors[0]};
    width: ${widthString};
    padding-bottom: ${widthString};
  }`;
  document.getElementsByTagName('head')[0].appendChild(blockStyle);

  var highlightStyle = document.createElement('style');
  highlightStyle.type = 'text/css';
  highlightStyle.innerHTML = `.highlight {
    background-color: ${state.colors[1]};
  }`;
  document.getElementsByTagName('head')[0].appendChild(highlightStyle);

  var iconStyle = document.createElement('style');
  iconStyle.type = 'text/css';
  iconStyle.innerHTML = `.icon-style {
    color: ${state.colors[1]};
    font-size: ${fontSize};
  }`
  document.getElementsByTagName('head')[0].appendChild(iconStyle);
}
