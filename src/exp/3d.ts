import { mat4, vec4 } from 'gl-matrix';
import { Camera3D } from '../r3d/camera3d';
import { createWebGLProgram } from '../r3d/shaders';

const vShaderSource = `#version 300 es
layout(location=0) in vec3 aPos;
layout(location=1) in vec2 aTexCord;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

out vec2 vTexCord;

void main() {
    gl_Position  = uProjection * uView * uModel * vec4(aPos, 1.0);
    vTexCord = aTexCord;
}
`;

const fShaderSource = `#version 300 es
precision mediump float;

out vec4 fragColor;

void main () {
    fragColor = vec4(1.0);
    // fragColor = vec4(0.25, 0.8, 0.4, 1.0);
}
`;

// prettier-ignore
const vertexData = new Float32Array([
    0, 0, 0,  // 0
    1, 0, 0,  // 1
    0, 1, 0,  // 2
    1, 1, 0,  // 3
]);

// prettier-ignore
const indices = new Uint16Array([
    0, 1, 2,
    2, 1, 3
]);

export const basic3dQuad = (gl: WebGL2RenderingContext): void => {
  const cam = new Camera3D();
  const program = createWebGLProgram(
    gl,
    vShaderSource,
    fShaderSource,
  ) as WebGLProgram;

  const vBuff = gl.createBuffer();
  const iBuff = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuff);
  gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuff);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  const uProjLoc = gl.getUniformLocation(program, 'uProjection');
  const uViewLoc = gl.getUniformLocation(program, 'uView');
  const uModelLoc = gl.getUniformLocation(program, 'uModel');

  if (!uProjLoc) console.error('skin::no projection found');
  if (!uViewLoc) console.error('skin::no view found');
  if (!uModelLoc) console.error('skin::no view found');

  cam.translateZ(5);
  cam.translateY(2);
  cam._update();
  gl.useProgram(program);

  const m = mat4.create();
  mat4.multiply(m, cam.pMatrix, cam.vMatrix);
  const pos = vec4.fromValues(0, 0, 0, 1);
  vec4.transformMat4(pos, pos, m);
  console.log('pos ', pos);
  const render = (): void => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(uProjLoc, false, cam.pMatrix);
    gl.uniformMatrix4fv(uViewLoc, false, cam.vMatrix);
    gl.uniformMatrix4fv(uModelLoc, false, m);

    gl.enableVertexAttribArray(0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuff);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuff);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(render);
  };

  render();
};
