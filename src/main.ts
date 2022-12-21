import { createWebGLProgram } from './r3d/shaders';
import { loadModel } from './r3d/models';
import { Mesh, MeshWithBuffers } from 'webgl-obj-loader';
import { mat4, vec3 } from 'gl-matrix';

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

in vec2 vTexCord;
uniform sampler2D uSampler;

out vec4 fragColor;

void main() {
    // fragColor = texture(uSampler, vTexCord);
    fragColor = vec4(1.0, 1.0, 1.0, 1.0);
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
  gl.clearColor(0.3, 0.3, 0.3, 1);
  // gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  const model = (await loadModel(
    gl,
    'build/assets/models/untitled.obj',
  )) as MeshWithBuffers;

  console.log(model);
  render(gl, model);
};

main();

const render = (gl: WebGL2RenderingContext, model: MeshWithBuffers): void => {
  const loop = (): void => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enableVertexAttribArray(0);

    const mMatrix = mat4.create();
    const pMatrix = mat4.create();
    const vMatrix = mat4.create();

    mat4.translate(vMatrix, vMatrix, vec3.fromValues(0.0, 0.0, -3.0));
    mat4.perspective(pMatrix, 45.0, 400 / 300, 0.1, 100.0);

    const program = createWebGLProgram(gl, vShaderSource, fShaderSource)!;
    gl.useProgram(program);
    const mMatrixLoc = gl.getUniformLocation(program, 'uModel');
    const vMatrixLoc = gl.getUniformLocation(program, 'uView');
    const pMatrixLoc = gl.getUniformLocation(program, 'uProjection');

    gl.uniformMatrix4fv(mMatrixLoc, false, mMatrix);
    gl.uniformMatrix4fv(vMatrixLoc, false, vMatrix);
    gl.uniformMatrix4fv(pMatrixLoc, false, pMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
    gl.vertexAttribPointer(
      0,
      model.vertexBuffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0,
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.drawElements(
      gl.TRIANGLES,
      model.indexBuffer.numItems,
      gl.UNSIGNED_SHORT,
      0,
    );
    // requestAnimationFrame(loop);
  };

  loop();
};
