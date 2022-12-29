import { mat4 } from 'gl-matrix';
import { MeshWithBuffers } from 'webgl-obj-loader';
import { Camera3D } from './camera3d';
import { Drawable3D } from './drawable3d';
import { createWebGLProgram } from './shaders';

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

export class Object3D extends Drawable3D {
  static defaultProgram: WebGLProgram;
  static mMatrixLoc: WebGLUniformLocation;
  static vMatrixLoc: WebGLUniformLocation;
  static pMatrixLoc: WebGLUniformLocation;

  mesh: MeshWithBuffers;
  constructor(gl: WebGL2RenderingContext, model: MeshWithBuffers) {
    super(gl);
    this.mesh = model;

    if (!Object3D.defaultProgram) {
      const program = createWebGLProgram(gl, vShaderSource, fShaderSource);

      if (!program) throw 'Failed to create default 3 shader';

      const mMatrixLoc = gl.getUniformLocation(program, 'uModel');
      const vMatrixLoc = gl.getUniformLocation(program, 'uView');
      const pMatrixLoc = gl.getUniformLocation(program, 'uProjection');

      if (!mMatrixLoc || !vMatrixLoc || !pMatrixLoc)
        throw 'Failed to get unform loations from default shader';

      Object3D.defaultProgram = program;
      Object3D.mMatrixLoc = mMatrixLoc;
      Object3D.vMatrixLoc = vMatrixLoc;
      Object3D.pMatrixLoc = pMatrixLoc;
    }
  }

  draw(): void {
    const gl = this.gl;

    gl.enableVertexAttribArray(0);
    // gl.enableVertexAttribArray(1);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
    gl.vertexAttribPointer(
      0,
      this.mesh.vertexBuffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0,
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
    gl.drawElements(
      gl.TRIANGLES,
      this.mesh.indexBuffer.numItems,
      gl.UNSIGNED_SHORT,
      0,
    );
    gl.disableVertexAttribArray(0);
    gl.disableVertexAttribArray(1);
  }

  _renderChildren(obj: Object3D, wMatrix: mat4): void {
    obj._update();
    mat4.multiply(wMatrix, wMatrix, obj.mMatrix);
    this.gl.uniformMatrix4fv(Object3D.mMatrixLoc, false, wMatrix);
    obj.draw();

    obj.children.forEach((child) => {
      if (child instanceof Object3D) this._renderChildren(child, wMatrix);
    });
  }

  render(camera: Camera3D, customProgram?: WebGLProgram): void {
    const gl = this.gl;
    camera._update();

    if (customProgram) gl.useProgram(customProgram);
    else gl.useProgram(Object3D.defaultProgram);

    gl.uniformMatrix4fv(Object3D.vMatrixLoc, false, camera.vMatrix);
    gl.uniformMatrix4fv(Object3D.pMatrixLoc, false, camera.pMatrix);

    // create world matrix
    const wMatrix = mat4.create();
    this._renderChildren(this, wMatrix);
  }
}
