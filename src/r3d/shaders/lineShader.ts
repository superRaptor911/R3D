import { createWebGLProgram } from '../shaders';

const vShaderSource = `#version 300 es
layout(location=0) in vec3 aPos;

void main() {
    gl_Position  = vec4(aPos, 1.0);
}
`;

const fShaderSource = `#version 300 es
precision mediump float;

uniform vec4 uColor;

out vec4 fragColor;

void main() {
    fragColor = uColor ;
}
`;

export interface ILineShader {
  program: WebGLProgram;
  aPosLoc: number;
  uColorLoc: WebGLUniformLocation;
}

export const createLineShader = (gl: WebGL2RenderingContext): ILineShader => {
  const program = createWebGLProgram(gl, vShaderSource, fShaderSource);
  if (!program) throw 'Failed to create rectangle shader';

  const uColorLoc = gl.getUniformLocation(program, 'uColor');

  if (!uColorLoc) {
    throw 'Failed to get uColorLoc uniform location for rect';
  }

  return {
    program,
    aPosLoc: 0,
    uColorLoc,
  };
};
