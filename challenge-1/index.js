var fs = require('fs')

var FRAG_SRC = fs.readFileSync(__dirname + '/frag.glsl', 'utf8')
var VERT_SRC = fs.readFileSync(__dirname + '/vert.glsl', 'utf8')

var DATA = require('./data.json')

var VERTICES = DATA.VERTICES
var ELEMENTS = DATA.ELEMENTS
var PIXELS   = DATA.PIXELS
var WIDTH    = DATA.WIDTH
var HEIGHT   = DATA.HEIGHT

var uCamera;

function cameraMatrix(t) {
  var a = Math.cos(0.001 * t)
  var b = Math.sin(0.000237 * t)
  var c = Math.cos(0.00057 * t + 3)
  var d = Math.cos(0.0008 * t + 1.3)
  var s = 0.25 / (a*a+b*b+c*c+d*d)
  return [
    s*(a*a+b*b-c*c-d*d), 2*s*(b*c+a*d), 2*s*(b*d-a*c), 0,
    2*s*(b*c-a*d), s*(a*a+c*c-b*b-d*d), 2*s*(c*d+a*b), 0,
    2*s*(b*d+a*c), 2*s*(c*d-a*b), s*(a*a+d*d-b*b-c*c), 0,
     0,  0,  0.5, 1 ]
}

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

function initVertexBuffer(gl, program) {
  var vertexData = new Float32Array(VERTICES);
  var vertexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 20, 0); // position
  gl.bindAttribLocation(program, 0, 'position')
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 20, 12); // uv
  gl.bindAttribLocation(program, 1, 'uv')
}

function initElementBuffer(gl) {
  var elementData = new Uint16Array(ELEMENTS);
  var elementBuffer = gl.createBuffer(gl.ELEMENT_ARRAY_BUFFER);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elementData, gl.DYNAMIC_DRAW);
}

function loadTexture(gl, textureSlot, pixels) {
  gl.activeTexture(textureSlot);
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, WIDTH, HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.generateMipmap(gl.TEXTURE_2D);
}

exports.init = function(gl) {
  var vertShader = createShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  var fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
  var program = createProgram(gl, vertShader, fragShader);
  initVertexBuffer(gl, program);
  initElementBuffer(gl);
  loadTexture(gl, gl.TEXTURE0, new Uint8Array(PIXELS));
  uCamera = gl.getUniformLocation(program, 'camera');
  gl.enable(gl.DEPTH_TEST);
  gl.useProgram(program);
}

exports.draw = function(gl, t) {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.clearColor(1,1,0,1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  var camera = cameraMatrix(t)
  gl.uniformMatrix4fv(uCamera, false, camera);

  gl.drawElements(gl.TRIANGLES, ELEMENTS.length, gl.UNSIGNED_SHORT, 0);
}
