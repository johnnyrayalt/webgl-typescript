attribute vec2 a_position;

uniform vec2 u_resolution;

void main() {
    vec2 one = a_position / u_resolution;
    vec2 two = one * 2.0;
    vec2 clipspace = two - 1.0;
    gl_Position = vec4(clipspace, 0, 1);
}
