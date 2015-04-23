uniform mat4 camera;
attribute vec3 position;
attribute vec2 uv;
varying vec2 texUv;

void main() {
  gl_Position = camera * vec4(position, 1);
  texUv = uv;
}
