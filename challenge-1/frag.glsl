precision mediump float;
uniform sampler2D tex;
varying vec2 texUv;

void main() {
  gl_FragColor = texture2D(tex, texUv);
}
