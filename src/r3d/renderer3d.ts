import { Camera3D } from './camera3d';
import { Object3D } from './object3d';
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

  render(obj: Object3D, camera: Camera3D): void {
    const gl = this.gl;
    camera._update();
    obj._update();

    gl.useProgram(this.defaultProgram);
    gl.uniformMatrix4fv(this.vMatrixLoc, false, camera.vMatrix);
    gl.uniformMatrix4fv(this.pMatrixLoc, false, camera.pMatrix);
    gl.uniformMatrix4fv(this.mMatrixLoc, false, obj.mMatrix);
    obj.render(gl);
  }
}
