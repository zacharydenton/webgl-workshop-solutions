var setup = require('./setup')
var drawIt

exports.init = function(gl) {
  drawIt = setup(gl)
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.FRONT);
}

exports.draw = function(gl) {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  drawIt(Date.now())
}
