import { mat4, vec3 } from 'gl-matrix';
import * as gltf from '@super_raptor911/webgl-gltf';
import { createWebGLProgram } from '../r3d/shaders';

const vsSource = `#version 300 es
layout (location=0) in vec4 vPosition;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vPosition;
}
`;

const fsSource = `#version 300 es
precision highp float;

out vec4 fragColor;

void main() {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

export const gltfTest = (gl: WebGL2RenderingContext): void => {
  const program = createWebGLProgram(gl, vsSource, fsSource) as WebGLProgram;
  const pMatrix = mat4.create();
  const vMatrix = mat4.create();
  const mMatrix = mat4.create();

  mat4.translate(vMatrix, vMatrix, vec3.fromValues(0.0, 0.0, -3.0));
  mat4.perspective(pMatrix, 45.0, 400 / 300, 0.1, 100.0);

  gl.useProgram(program);

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, 'uProjectionMatrix'),
    false,
    pMatrix,
  );
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, 'uViewMatrix'),
    false,
    vMatrix,
  );

  const mMatrixLoc = gl.getUniformLocation(program, 'uModelMatrix');

  // Load model
  gltf.loadModel(gl, 'build/assets/models/robot.gltf').then((model) => {
    gl.enableVertexAttribArray(0);

    const render = (): void => {
      gl.clear(gl.COLOR_BUFFER_BIT);

      mat4.rotateX(mMatrix, mMatrix, 0.001);
      mat4.rotateY(mMatrix, mMatrix, 0.001);
      gl.uniformMatrix4fv(mMatrixLoc, false, mMatrix);

      const mesh = model.meshes[0];

      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positions.buffer);
      gl.vertexAttribPointer(
        0,
        mesh.positions.size,
        mesh.positions.type,
        false,
        0,
        0,
      );

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indices);
      gl.drawElements(gl.TRIANGLES, mesh.elementCount, gl.UNSIGNED_SHORT, 0);

      requestAnimationFrame(() => {
        render();
      });
    };

    // Render
    render();
  });
};
