//No support code to help you here, you are on your own!

var fs = require('fs')

var FRAG_SRC = fs.readFileSync(__dirname + '/frag.glsl', 'utf8')
var VERT_SRC = fs.readFileSync(__dirname + '/vert.glsl', 'utf8')

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

exports.init = function(gl) {
  var vertShader = createShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  var fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
  var program = createProgram(gl, vertShader, fragShader);

  var triangleData = new Float32Array([
    0, 1,
    -1, 0,
    1, 0
  ]);
  var triangleBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, triangleData, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);
}

exports.draw = function(gl) {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

  //Clear drawing buffer
  gl.clearColor(1,1,0,1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.TRIANGLES, 0, 3);
}
