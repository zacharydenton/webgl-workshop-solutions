//This is a helper function to make it easier to get started.
//You should call this function once your shader is set up
var drawTriangle = require('./draw-triangle')
var fs = require('fs')

//Load the fragment/vertex shader sources
var FRAG_SRC = fs.readFileSync(__dirname + '/shader.frag', 'utf8')
var VERT_SRC = fs.readFileSync(__dirname + '/shader.vert', 'utf8')

function createShader(gl, shaderType, shaderSrc) {
  var shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSrc);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
  }
  return shader;
}

function createProgram(gl, vertShader, fragShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Error linking program:', gl.getProgramInfoLog(program))
  }
  return program;
}

// Run once at the beginning: use this to create
// and setup things to be used in your draw function.
exports.init = function(gl) {
  var vertShader = createShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  var fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
  var program = createProgram(gl, vertShader, fragShader);
  gl.useProgram(program);
}

// Run every frame: use this to draw things to the screen.
exports.draw = function(gl) {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

  //Clear drawing buffer
  gl.clearColor(0,0,0,1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  //Now draw the triangle
  drawTriangle(gl)
}
