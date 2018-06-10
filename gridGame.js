$(document).ready(() => {
  createGrid(5);
});

function createGrid(size) {
  var color = "rgb(" + Math.floor(Math.random() * 256) +
    ", " + Math.floor(Math.random() * 256) +
    ", " + Math.floor(Math.random() * 256) + ")";
  console.log(color);
  for (var i=0; i<size*size; i++) {
    $('.game').append('<div class="block"></div>')
    $('.game .block').css('background-color', color);
  }
}
