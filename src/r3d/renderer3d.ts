import { mat4 } from 'gl-matrix';
import { Camera3D } from './camera3d';
import { Object3D } from './object3d';
import { createWebGLProgram } from './shaders';
import { fShaderSource, vShaderSource } from './shaders/basic3d';

export class Renderer3D {
  gl: WebGL2RenderingContext;
  defaultProgram: WebGLProgram;
  mMatrixLoc: WebGLUniformLocation;
  vMatrixLoc: WebGLUniformLocation;
  pMatrixLoc: WebGLUniformLocation;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    const program = createWebGLProgram(gl, vShaderSource, fShaderSource);

    if (!program) throw 'Failed to create default 3 shader';

    const mMatrixLoc = gl.getUniformLocation(program, 'uModel');
    const vMatrixLoc = gl.getUniformLocation(program, 'uView');
    const pMatrixLoc = gl.getUniformLocation(program, 'uProjection');

    if (!mMatrixLoc || !vMatrixLoc || !pMatrixLoc)
      throw 'Failed to get unform loations from default shader';

    this.defaultProgram = program;
    this.mMatrixLoc = mMatrixLoc;
    this.vMatrixLoc = vMatrixLoc;
    this.pMatrixLoc = pMatrixLoc;
  }

  _render(obj: Object3D, wMatrix: mat4): void {
    mat4.multiply(wMatrix, wMatrix, obj.mMatrix);
    obj._update();
    this.gl.uniformMatrix4fv(this.mMatrixLoc, false, wMatrix);
    obj.draw(this.gl);

    obj.children.forEach((child) => {
      if (child instanceof Object3D) this._render(child, wMatrix);
    });
  }

  render(obj: Object3D, camera: Camera3D, customProgram?: WebGLProgram): void {
    const gl = this.gl;
    camera._update();

    if (customProgram) gl.useProgram(customProgram);
    else gl.useProgram(this.defaultProgram);

    gl.uniformMatrix4fv(this.vMatrixLoc, false, camera.vMatrix);
    gl.uniformMatrix4fv(this.pMatrixLoc, false, camera.pMatrix);

    // create world matrix
    const wMatrix = mat4.create();
    this._render(obj, wMatrix);
  }
}
