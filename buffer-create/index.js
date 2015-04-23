//These methods are provided for you and handle creating
//the shader and drawing the contents of the buffer
var setupShader = require('./setup-shader')
var drawIt = require('./draw-it')

//This is the data for the outline of the text
var DATA = require('./vertices.json')

//These variables are initialized in init()
var program, buffer, uScreenSize

exports.init = function(gl) {
  program = setupShader(gl)
  uScreenSize = gl.getUniformLocation(program, 'uScreenSize')

  var data = new Float32Array(DATA);
  buffer = gl.createBuffer(gl.ARRAY_BUFFER);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
}

exports.draw = function(gl) {
  var width = gl.drawingBufferWidth
  var height = gl.drawingBufferHeight

  gl.viewport(0, 0, width, height)
  gl.clearColor(0,0,0,1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(program)
  gl.uniform2f(uScreenSize, width, height)

  drawIt(gl, buffer)
}
