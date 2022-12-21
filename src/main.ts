import { createWebGLProgram } from './r3d/shaders';
import { createTextureFromImage, loadImage } from './r3d/textures';

const vShaderSource = `#version 300 es
in vec3 aPos;
in vec2 aTexCord;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

out vec2 vTexCord;

void main() {
    gl_Position  = vec4(aPos, 1.0);
    vTexCord = aTexCord;
}
`;

const fShaderSource = `#version 300 es
precision mediump float;

in vec2 vTexCord;
uniform sampler2D uSampler;

out vec4 fragColor;

void main() {
    fragColor = texture(uSampler, vTexCord);
}
`;

const main = async (): Promise<void> => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  if (!canvas) {
    console.error('main::Failed to get canvas');
    return;
  }

  canvas.width = 1280;
  canvas.height = 720;

  const gl = canvas.getContext('webgl2');
  if (!gl) {
    console.error('main::Failed to get webgl2 context');
    return;
  }
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  const program = createWebGLProgram(gl, vShaderSource, fShaderSource)!;
  gl.useProgram(program);

  const image = await loadImage('build/assets/images/tank.jpg');
  const texture = createTextureFromImage(gl, image);
  const bufferData = new Float32Array([
    -1, -1, 0, 0, 0, 1, 0.5, 1, 1, -1, 1, 0,
  ]);

  const aPosLoc = gl.getAttribLocation(program, 'aPos');
  const aUVloc = gl.getAttribLocation(program, 'aTexCord');

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);

  gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 4 * 4, 0);
  gl.vertexAttribPointer(aUVloc, 2, gl.FLOAT, false, 4 * 4, 2 * 4);

  gl.enableVertexAttribArray(aPosLoc);
  gl.enableVertexAttribArray(aUVloc);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

main();
