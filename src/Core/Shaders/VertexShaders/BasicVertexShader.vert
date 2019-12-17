attribute vec2 a_position;

uniform vec2 u_resolution;

void main() {
    vec2 one = a_position / u_resolution;
    vec2 two = one * 2.0;
    vec2 clipSpace = two - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}