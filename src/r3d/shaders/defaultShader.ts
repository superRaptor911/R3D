import { createWebGLProgram } from '../shaders';

const vShaderSource = `#version 300 es
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNormals;
layout(location=2) in vec2 aTexCord;

uniform vec3 uDiffuseLightDir;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

out vec2 vTexCord;
out float vBrightness;

void main() {
    mat4 transform = uProjection * uView * uModel; 
    gl_Position  =  transform * vec4(aPos, 1.0);
    vTexCord = aTexCord;

    vec3 normal = normalize(mat3(transform) * aNormals);
    vBrightness = max(dot(uDiffuseLightDir, normal),0.0);
}
`;

const fShaderSource = `#version 300 es
precision mediump float;

in vec2 vTexCord;
in float vBrightness;
uniform sampler2D baseTexture;

out vec4 fragColor;

void main() {
    vec4 color = texture(baseTexture, vTexCord) * vec4(1.0);
    fragColor = 0.2 * color + 0.8 * color * vBrightness; 
    fragColor.a = 1.0;
}
`;

export interface IDefaultShader {
  program: WebGLProgram;
  mMatrixLoc: WebGLUniformLocation;
  vMatrixLoc: WebGLUniformLocation;
  pMatrixLoc: WebGLUniformLocation;
  baseTextureLoc: WebGLUniformLocation;
  uLightDirLoc: WebGLUniformLocation;
  aPositions: number;
  aNormals: number;
  aTexCord: number;
}

export const createDefaultShader = (
  gl: WebGL2RenderingContext,
): IDefaultShader => {
  const program = createWebGLProgram(gl, vShaderSource, fShaderSource);
  if (!program) throw 'Failed to create rectangle shader';

  const mMatrixLoc = gl.getUniformLocation(program, 'uModel');
  const vMatrixLoc = gl.getUniformLocation(program, 'uView');
  const pMatrixLoc = gl.getUniformLocation(program, 'uProjection');
  const baseTextureLoc = gl.getUniformLocation(program, 'baseTexture');
  const uLightDirLoc = gl.getUniformLocation(program, 'uDiffuseLightDir');

  if (!mMatrixLoc) {
    throw 'Failed to get uModel uniform location for default shader';
  }
  if (!vMatrixLoc) {
    throw 'Failed to get uColorLoc uniform location for default shader';
  }

  if (!pMatrixLoc) {
    throw 'Failed to get pMatrixLoc uniform location for default shader';
  }

  if (!baseTextureLoc) {
    throw 'Failed to get baseTexture uniform location for default shader';
  }

  if (!uLightDirLoc) {
    throw 'Failed to get uDiffuseLightDir uniform location for default shader';
  }

  return {
    program,
    mMatrixLoc,
    vMatrixLoc,
    pMatrixLoc,
    baseTextureLoc,
    uLightDirLoc,
    aPositions: 0,
    aNormals: 1,
    aTexCord: 2,
  };
};
