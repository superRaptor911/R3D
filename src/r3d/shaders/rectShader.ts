import { createWebGLProgram } from '../shaders';

const vShaderSource = `#version 300 es
layout(location=0) in vec2 aPos;
layout(location=1) in vec2 aTexCord;

uniform mat3 uModel;
out vec2 vTexCord;

void main() {
    gl_Position  = vec4((uModel * vec3(aPos, 1.0)).xy, 0.9999, 1.0);
    vTexCord = aTexCord;
}
`;

const fShaderSource = `#version 300 es
precision mediump float;

in vec2 vTexCord;
uniform vec4 uColor;
uniform sampler2D uSampler;

out vec4 fragColor;

void main() {
    fragColor = texture(uSampler, vTexCord) + uColor ;
}
`;

export interface IRectShader {
  program: WebGLProgram;
  uModelLoc: WebGLUniformLocation;
  uColorLoc: WebGLUniformLocation;
  uSamplerLoc: WebGLUniformLocation;
}

export const createRectShader = (gl: WebGL2RenderingContext): IRectShader => {
  const program = createWebGLProgram(gl, vShaderSource, fShaderSource);
  if (!program) throw 'Failed to create rectangle shader';

  const uModelLoc = gl.getUniformLocation(program, 'uModel');
  const uColorLoc = gl.getUniformLocation(program, 'uColor');
  const uSamplerLoc = gl.getUniformLocation(program, 'uSampler');

  if (!uModelLoc) {
    throw 'Failed to get uModel uniform location for rect';
  }
  if (!uColorLoc) {
    throw 'Failed to get uColorLoc uniform location for rect';
  }

  if (!uSamplerLoc) {
    throw 'Failed to get SamplerLoc uniform location for rect';
  }

  return {
    program,
    uModelLoc,
    uColorLoc,
    uSamplerLoc,
  };
};
