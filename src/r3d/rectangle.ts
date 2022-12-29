import { mat3, vec2, vec4 } from 'gl-matrix';
import { createRectShader, IRectShader } from './shaders/rectShader';

export class Rectangle {
  static _vertices = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
  static _indices = new Uint16Array([0, 1, 2, 2, 1, 3]);

  static _vertexBuffer: WebGLBuffer;
  static _indexBuffer: WebGLBuffer;

  static _shader: IRectShader;

  _width = 1;
  _height = 1;

  texture: WebGLTexture | null = null;
  color: vec4;
  _x = 0;
  _y = 0;

  _mMatrix = mat3.create();

  _gl: WebGL2RenderingContext;
  _isDirty = true;

  _init(gl: WebGL2RenderingContext): void {
    this._gl = gl;
    const vBuffer = gl.createBuffer();
    if (!vBuffer) throw 'Failed to create vertex buffer';

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Rectangle._vertices, gl.STATIC_DRAW);

    const iBuffer = gl.createBuffer();
    if (!iBuffer) throw 'Failed to create vertex buffer';
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Rectangle._indices, gl.STATIC_DRAW);

    Rectangle._indexBuffer = iBuffer;
    Rectangle._vertexBuffer = vBuffer;
    Rectangle._shader = createRectShader(gl);
  }

  constructor(gl: WebGL2RenderingContext, x = 0, y = 0, width = 1, height = 1) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this.color = vec4.create();
    this._update();

    if (!this._gl || this._gl != gl) {
      this._init(gl);
    }
  }

  setColor(r: number, g: number, b: number, a = 1): void {
    this.color[0] = r;
    this.color[1] = g;
    this.color[2] = b;
    this.color[3] = a;
  }

  _update(): void {
    if (!this._isDirty) return;

    const x = this._x;
    const y = this._y;

    const proj = mat3.create();
    const scale = mat3.create();
    const trans = mat3.create();

    mat3.projection(proj, 1, 1);
    mat3.fromScaling(scale, vec2.fromValues(this._width, this._height));
    mat3.fromTranslation(trans, vec2.fromValues(x, y));

    mat3.multiply(this._mMatrix, trans, scale);
    mat3.multiply(this._mMatrix, proj, this._mMatrix);

    this._isDirty = false;
  }

  draw(): void {
    const gl = this._gl;
    gl.useProgram(Rectangle._shader.program);
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);

    gl.bindBuffer(gl.ARRAY_BUFFER, Rectangle._vertexBuffer);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

    if (this.texture) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.uniform1i(Rectangle._shader.uSamplerLoc, 0);
    }

    gl.uniform4f(
      Rectangle._shader.uColorLoc,
      this.color[0],
      this.color[1],
      this.color[2],
      this.color[3],
    );
    gl.uniformMatrix3fv(Rectangle._shader.uModelLoc, false, this._mMatrix);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Rectangle._indexBuffer);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    gl.disableVertexAttribArray(0);
    gl.disableVertexAttribArray(1);
  }
}
