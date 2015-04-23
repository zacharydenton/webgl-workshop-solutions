var setup         = require('./setup')
var draw

exports.init = function(gl) {
  draw = setup(gl)
}

exports.draw = function(gl, t) {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.clearColor(1,1,1,1)
  gl.clearDepth(1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Render the scene fully lit.
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.depthMask(true);
  gl.disable(gl.STENCIL_TEST);
  gl.colorMask(true, true, true, true);
  draw.mesh(t, 1.0)

  // Construct shadow mask.
  gl.enable(gl.STENCIL_TEST);
  gl.clearStencil(0);
  gl.clear(gl.STENCIL_BUFFER_BIT);
  gl.stencilFunc(gl.ALWAYS, 0, 0xff);
  gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.DECR_WRAP, gl.KEEP);
  gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.INCR_WRAP, gl.KEEP);
  gl.colorMask(false, false, false, false);
  gl.depthMask(false);
  gl.depthFunc(gl.LESS);
  draw.shadow(t)

  // Render the shadows.
  gl.colorMask(true, true, true, true);
  gl.depthFunc(gl.LEQUAL);
  gl.stencilFunc(gl.NOTEQUAL, 0, 0xff);
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
  draw.mesh(t, 0.1)
}
