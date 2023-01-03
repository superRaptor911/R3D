import { createWebGLProgram } from '../shaders';

const maxJoints = 20;

const vShaderSource = `#version 300 es
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNormals;
layout(location=2) in vec2 aTexCord;
layout(location=3) in vec4 aWeights;
layout(location=4) in vec4 aJoints;

uniform vec3 uDiffuseLightDir;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uJoints[${maxJoints}];

out vec2 vTexCord;
out float vBrightness;

void main() {
    mat4 skinning = mat4(0);
    for (int i = 0; i < 4; i++) {
        skinning += uJoints[int(aJoints[i])] * aWeights[i];
    }

    mat4 transform = uProjection * uView * uModel * skinning; 
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
uniform sampler2D uSampler;

out vec4 fragColor;

void main() {
    vec4 color = texture(uSampler, vTexCord) + vec4(1.0);
    fragColor = 0.2 * color + 0.8 * color * vBrightness; 
    fragColor.a = 1.0;
}
`;

export interface ISkinShader {
  program: WebGLProgram;
  mMatrixLoc: WebGLUniformLocation;
  vMatrixLoc: WebGLUniformLocation;
  pMatrixLoc: WebGLUniformLocation;
  uSamplerLoc: WebGLUniformLocation;
  uLightDirLoc: WebGLUniformLocation;
  uJointsLocs: WebGLUniformLocation[];
  aPositions: number;
  aNormals: number;
  aTexCord: number;
  aWeights: number;
  aJoints: number;
  maxJoints: number;
}

export const createSkinShader = (gl: WebGL2RenderingContext): ISkinShader => {
  const program = createWebGLProgram(gl, vShaderSource, fShaderSource);
  if (!program) throw 'Failed to create rectangle shader';

  const mMatrixLoc = gl.getUniformLocation(program, 'uModel');
  const vMatrixLoc = gl.getUniformLocation(program, 'uView');
  const pMatrixLoc = gl.getUniformLocation(program, 'uProjection');
  const uSamplerLoc = gl.getUniformLocation(program, 'uSampler');
  const uLightDirLoc = gl.getUniformLocation(program, 'uDiffuseLightDir');

  const uJointsLocs: WebGLUniformLocation[] = [];

  for (let i = 0; i < maxJoints; i++) {
    const loc = gl.getUniformLocation(program, `uJoints[${i}]`);
    if (!loc) {
      throw `Failed to get uJointsLoc[${i}] uniform location for skin shader`;
    }

    uJointsLocs.push(loc);
  }

  if (!mMatrixLoc) {
    throw 'Failed to get uModel uniform location for skin shader';
  }
  if (!vMatrixLoc) {
    throw 'Failed to get uColorLoc uniform location for skin shader';
  }

  if (!pMatrixLoc) {
    throw 'Failed to get pMatrixLoc uniform location for skin shader';
  }

  if (!uSamplerLoc) {
    throw 'Failed to get SamplerLoc uniform location for skin shader';
  }

  if (!uLightDirLoc) {
    throw 'Failed to get uDiffuseLightDir uniform location for skin shader';
  }

  return {
    program,
    mMatrixLoc,
    vMatrixLoc,
    pMatrixLoc,
    uSamplerLoc,
    uLightDirLoc,
    uJointsLocs,
    aPositions: 0,
    aNormals: 1,
    aTexCord: 2,
    aWeights: 3,
    aJoints: 4,
    maxJoints,
  };
};
