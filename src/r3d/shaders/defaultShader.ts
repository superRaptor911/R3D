import { createWebGLProgram } from '../shaders';

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

export interface IDefaultShader {
  program: WebGLProgram;
  mMatrixLoc: WebGLUniformLocation;
  vMatrixLoc: WebGLUniformLocation;
  pMatrixLoc: WebGLUniformLocation;
}

export const createDefaultShader = (
  gl: WebGL2RenderingContext,
): IDefaultShader => {
  const program = createWebGLProgram(gl, vShaderSource, fShaderSource);
  if (!program) throw 'Failed to create rectangle shader';

  const mMatrixLoc = gl.getUniformLocation(program, 'uModel');
  const vMatrixLoc = gl.getUniformLocation(program, 'uView');
  const pMatrixLoc = gl.getUniformLocation(program, 'uProjection');

  if (!mMatrixLoc) {
    throw 'Failed to get uModel uniform location for default shader';
  }
  if (!vMatrixLoc) {
    throw 'Failed to get uColorLoc uniform location for default shader';
  }

  if (!pMatrixLoc) {
    throw 'Failed to get SamplerLoc uniform location for default shader';
  }

  return {
    program,
    mMatrixLoc,
    vMatrixLoc,
    pMatrixLoc,
  };
};
