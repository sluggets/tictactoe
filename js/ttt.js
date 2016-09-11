document.addEventListener("DOMContentLoaded", function() {
  testX();
});

function testX()
{
  XCtr = 285;
  YCtr = 10;
  var canvas = document.getElementById("tl");
  var ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(285, 10);
  ctx.lineTo(10, 135);
  ctx.stroke();
}

