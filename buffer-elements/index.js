var setup         = require('./setup')
var ELEMENT_DATA  = require('./data.json').elements
var ELEMENT_COUNT = ELEMENT_DATA.length

var setAngle

exports.init = function(gl) {
  setAngle = setup(gl)

  var elementData = new Uint16Array(ELEMENT_DATA);
  var elementBuffer = gl.createBuffer(gl.ELEMENT_ARRAY_BUFFER);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elementData, gl.STATIC_DRAW);
}

exports.draw = function(gl, t) {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.clearColor(1,1,1,1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  setAngle(0.003 * t)

  gl.drawElements(gl.TRIANGLES, ELEMENT_COUNT, gl.UNSIGNED_SHORT, 0);
}
