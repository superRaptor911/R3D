import { mat4, vec3 } from 'gl-matrix';
import { Camera3D } from '../r3d/camera3d';
import { createWebGLProgram } from '../r3d/shaders';

const vShaderSource = `#version 300 es
layout(location = 0) in vec3 a;
layout(location = 1) in vec4 a_weight;
layout(location = 2) in uvec4 a_boneNdx;

uniform mat4 projection;
uniform mat4 view;
uniform sampler2D boneMatrixTexture;

mat4 getBoneMatrix(uint boneNdx) {
    return mat4(
      texelFetch(boneMatrixTexture, ivec2(0, boneNdx), 0),
      texelFetch(boneMatrixTexture, ivec2(1, boneNdx), 0),
      texelFetch(boneMatrixTexture, ivec2(2, boneNdx), 0),
      texelFetch(boneMatrixTexture, ivec2(3, boneNdx), 0));
}

void main() {
    vec4 a_position = vec4(a.x, a.y, a.z, 1.0);
    gl_Position = projection * view *
        (getBoneMatrix(a_boneNdx[0]) * a_position * a_weight[0] +
         getBoneMatrix(a_boneNdx[1]) * a_position * a_weight[1] +
         getBoneMatrix(a_boneNdx[2]) * a_position * a_weight[2] +
         getBoneMatrix(a_boneNdx[3]) * a_position * a_weight[3]);

}
`;

const fShaderSource = `#version 300 es
precision mediump float;

out vec4 fragColor;

void main () {
    fragColor = vec4(1.0);
    // fragColor = vec4(0.25, 0.8, 0.4, 1.0);
}
`;

// prettier-ignore
const vertexData = new Float32Array([
    0,  1, 0,  // 0
    0, -1, 0,  // 1
    2,  1, 0,  // 2
    2, -1, 0,  // 3
    4,  1, 0,  // 4
    4, -1, 0,  // 5
    6,  1, 0,  // 6
    6, -1, 0,  // 7
    8,  1, 0,  // 8
    8, -1, 0,  // 9
]);

// prettier-ignore
const boneNdx = new Uint8Array([
    0, 0, 0, 0,  // 0
    0, 0, 0, 0,  // 1
    0, 1, 0, 0,  // 2
    0, 1, 0, 0,  // 3
    1, 0, 0, 0,  // 4
    1, 0, 0, 0,  // 5
    1, 2, 0, 0,  // 6
    1, 2, 0, 0,  // 7
    2, 0, 0, 0,  // 8
    2, 0, 0, 0,  // 9
]);

// prettier-ignore
const weights = new Float32Array([
    1, 0, 0, 0,  // 0
    1, 0, 0, 0,  // 1
    .5,.5, 0, 0,  // 2
    .5,.5, 0, 0,  // 3
    1, 0, 0, 0,  // 4
    1, 0, 0, 0,  // 5
    .5,.5, 0, 0,  // 6
    .5,.5, 0, 0,  // 7
    1, 0, 0, 0,  // 8
    1, 0, 0, 0,  // 9
]);

// prettier-ignore
const indices = new Uint16Array([
    // 1, 3, 2,
    // 2, 0, 1,

    // 3, 5, 4,
    // 4, 2, 3,

    // 5, 7, 6,
    // 6, 4, 5,

    // 7, 9, 8,
    // 8, 6, 7
    0, 1,
    0, 2,
    1, 3,
    2, 3, //
    2, 4,
    3, 5,
    4, 5,
    4, 6,
    5, 7, //
    6, 7,
    6, 8,
    7, 9,
    8, 9,
]);

const genBoneMatrices = (): mat4[] => {
  const bones: mat4[] = [];
  for (let i = 0; i < 4; i++) {
    bones.push(mat4.create());
  }
  return bones;
};

const genInverseMatrices = (bones: mat4[]): mat4[] => {
  const newBones = genBoneMatrices();
  newBones.forEach((bone, i) => mat4.invert(bone, bones[i]));
  return newBones;
};

const computePositions = (bones: mat4[]): void => {
  mat4.translate(bones[0], bones[0], vec3.fromValues(2, 0, 0));
  mat4.translate(bones[1], bones[1], vec3.fromValues(4, 0, 0));
  mat4.translate(bones[2], bones[2], vec3.fromValues(6, 0, 0));
  mat4.translate(bones[3], bones[3], vec3.fromValues(8, 0, 0));
};

const computeBoneArray = (
  bonesArray: Float32Array,
  bones: mat4[],
  bonesInverse: mat4[],
): void => {
  const matrix = mat4.create();
  bones.forEach((m, i) => {
    mat4.multiply(matrix, m, bonesInverse[i]);
    for (let j = 0; j < 16; j++) {
      bonesArray[i * 16 + j] = matrix[j];
    }
  });
};

export const skinExperiment = (gl: WebGL2RenderingContext): void => {
  const cam = new Camera3D();
  const program = createWebGLProgram(
    gl,
    vShaderSource,
    fShaderSource,
  ) as WebGLProgram;

  const vBuff = gl.createBuffer();
  const boneNdxBuff = gl.createBuffer();
  const weightBuff = gl.createBuffer();
  const iBuff = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuff);
  gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, boneNdxBuff);
  gl.bufferData(gl.ARRAY_BUFFER, boneNdx, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, weightBuff);
  gl.bufferData(gl.ARRAY_BUFFER, weights, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuff);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);
  gl.enableVertexAttribArray(2);

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuff);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, weightBuff);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, boneNdxBuff);
  gl.vertexAttribIPointer(2, 4, gl.UNSIGNED_BYTE, 0, 0);

  const bones = genBoneMatrices();
  computePositions(bones);

  const bonesInverse = genInverseMatrices(bones);
  const bonesArray = new Float32Array(16 * 4);
  computeBoneArray(bonesArray, bones, bonesInverse);

  const uProjLoc = gl.getUniformLocation(program, 'projection');
  const uViewLoc = gl.getUniformLocation(program, 'view');

  const uBoneTexLoc = gl.getUniformLocation(program, 'boneMatrixTexture');

  if (!uBoneTexLoc) console.error('skin::boneMatrixTexture not found');

  cam.translateZ(5);
  cam.translateX(5);
  cam._update();

  gl.useProgram(program);
  gl.uniformMatrix4fv(uProjLoc, false, cam.pMatrix);
  gl.uniformMatrix4fv(uViewLoc, false, cam.vMatrix);

  const ext = gl.getExtension('EXT_color_buffer_float');
  if (!ext) console.error('skin::extension not available');

  // console.log(bonesArray);
  // mat4.translate(bones[1], bones[1], vec3.fromValues(5, 0, 0));
  // computeBoneArray(bonesArray, bones, bonesInverse);

  // console.log(bonesArray);
  const boneMatrixTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, boneMatrixTexture);
  // off filtering
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  // also turn off wrapping since the texture might not be a power of 2
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, boneMatrixTexture);
  gl.uniform1i(uBoneTexLoc, 0);

  const render = (time: number): void => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const t = time * 0.001;
    const angle = Math.sin(t) * 0.8;

    mat4.rotateZ(bones[2], bones[2], angle / 100);
    computeBoneArray(bonesArray, bones, bonesInverse);

    gl.bindTexture(gl.TEXTURE_2D, boneMatrixTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA32F,
      4,
      4,
      0,
      gl.RGBA,
      gl.FLOAT,
      bonesArray,
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuff);
    gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(render);
  };

  render(0);
};
