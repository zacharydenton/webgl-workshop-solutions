var setup  = require('./setup')

//Image data
var PIXELS = new Uint8Array(require('./data.json'))
var WIDTH  = 512
var HEIGHT = 512

//PIXELS is a flat length 512x512x4 array of RGBA values
//in the range 0-255

var drawIt

exports.init = function(gl) {
  drawIt = setup(gl)

  //TODO: Create a 2D texture and bind it. The content
  //of the texture should come from the PIXELS array
  //defined above.
  //
  //The texture must not use any filtering (gl.NEAREST)
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  var pixels = new Uint8Array(PIXELS);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, WIDTH, HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
}

exports.draw = function(gl) {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  drawIt()
}
