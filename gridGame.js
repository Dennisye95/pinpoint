$(document).ready(() => {
  createGrid(5);
  addDot(2,2,5);
  addDot(4,3,5);
  addDot(1,5,5);
});

function createGrid(size) {
  var color = "rgb(" + Math.floor(Math.random() * 256) +
    ", " + Math.floor(Math.random() * 256) +
    ", " + Math.floor(Math.random() * 256) + ")";
  console.log(color);
  for (var i=0; i<size*size; i++) {
    $('.game').append('<div class="block"></div>');
    $('.game .block').css('background-color', color);
  }
}

function addDot(x, y, size) {
  var index = (y - 1) * size + x;
  $('.game .block').empty();
  $('.game .block:nth-child(' + index + ')').html('<i class="dot fas fa-circle"></i>');
}
