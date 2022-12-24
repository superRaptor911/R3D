import { mat3, vec2, vec4 } from 'gl-matrix';
import { createWebGLProgram } from './shaders';

const vShaderSource = `#version 300 es
layout(location=0) in vec2 aPos;
layout(location=1) in vec2 aTexCord;

uniform mat3 uModel;
out vec2 vTexCord;

void main() {
    gl_Position  = vec4(uModel * vec3(aPos, 1.0), 1.0);
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
    fragColor = texture(uSampler, vTexCord) + uColor + vec4(1.0, 1.0, 1.0, 1.0);
}
`;

export class Rectangle {
  static _vertices = new Float32Array([
    -1, -1, 0, 0,

    1, -1, 1, 1,

    -1, 1, 0, 1,

    1, 1, 1, 1,
  ]);
  // static _uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]);
  static _indices = new Uint16Array([0, 1, 2, 2, 1, 3]);

  static _vertexBuffer: WebGLBuffer;
  static _indexBuffer: WebGLBuffer;

  static _defaultProgram: WebGLProgram;
  static _uModelLoc: WebGLUniformLocation;
  static _uColorLoc: WebGLUniformLocation;
  static _uSamplerLoc: WebGLUniformLocation;

  width = 1;
  height = 1;

  texture: WebGLTexture | null = null;
  color: vec4;
  x = 0;
  y = 0;

  _gl: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext, x = 0, y = 0, width = 1, height = 1) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this._gl = gl;
    this.color = vec4.create();

    if (!Rectangle._vertexBuffer) {
      const program = createWebGLProgram(gl, vShaderSource, fShaderSource);
      if (!program) throw 'Failed to create default Rectangle shader';

      const vBuffer = gl.createBuffer();
      if (!vBuffer) throw 'Failed to create vertex buffer';

      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, Rectangle._vertices, gl.STATIC_DRAW);

      const iBuffer = gl.createBuffer();
      if (!iBuffer) throw 'Failed to create vertex buffer';
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        Rectangle._indices,
        gl.STATIC_DRAW,
      );

      const uModelLoc = gl.getUniformLocation(program, 'uModel');
      const uColorLoc = gl.getUniformLocation(program, 'uColor');
      const uSamplerLoc = gl.getUniformLocation(program, 'uSampler');

      if (!uModelLoc) {
        throw 'Failed to get uModel uniform location';
      }
      if (!uColorLoc) {
        throw 'Failed to get uColorLoc uniform location';
      }

      if (!uSamplerLoc) {
        throw 'Failed to get SamplerLoc uniform location';
      }

      Rectangle._indexBuffer = iBuffer;
      Rectangle._vertexBuffer = vBuffer;
      Rectangle._defaultProgram = program;
      Rectangle._uModelLoc = uModelLoc;
      Rectangle._uColorLoc = uColorLoc;
      Rectangle._uSamplerLoc = uSamplerLoc;
    }
  }

  setColor(r: number, g: number, b: number, a = 1): void {
    this.color[0] = r;
    this.color[1] = g;
    this.color[2] = b;
    this.color[3] = a;
  }

  draw(): void {
    const mMatrix = mat3.create();
    mat3.translate(mMatrix, mMatrix, vec2.fromValues(this.x, this.y));
    mat3.scale(
      mMatrix,
      mMatrix,
      vec2.fromValues(1 / this.width, 1 / this.height),
    );

    const gl = this._gl;
    gl.useProgram(Rectangle._defaultProgram);
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);

    gl.bindBuffer(gl.ARRAY_BUFFER, Rectangle._vertexBuffer);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 4 * 4, 0);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 4 * 4, 4 * 2);

    if (this.texture) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.uniform1i(Rectangle._uSamplerLoc, 0);
    }

    gl.uniform4f(
      Rectangle._uColorLoc,
      this.color[0],
      this.color[1],
      this.color[2],
      this.color[3],
    );
    gl.uniformMatrix3fv(Rectangle._uModelLoc, false, mMatrix);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Rectangle._indexBuffer);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    gl.disableVertexAttribArray(0);
    gl.disableVertexAttribArray(1);
  }
}
