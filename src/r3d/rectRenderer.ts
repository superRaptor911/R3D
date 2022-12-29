import { Rectangle } from './rectangle';
import { createRectShader, IRectShader } from './shaders/rectShader';

export class RectRenderer {
  _gl: WebGL2RenderingContext;

  _vertices = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
  _indices = new Uint16Array([0, 1, 2, 2, 1, 3]);

  _vertexBuffer: WebGLBuffer;
  _indexBuffer: WebGLBuffer;

  _shader: IRectShader;

  constructor(gl: WebGL2RenderingContext) {
    this._gl = gl;

    const vBuffer = gl.createBuffer();
    if (!vBuffer) throw 'Failed to create vertex buffer';

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.STATIC_DRAW);

    const iBuffer = gl.createBuffer();
    if (!iBuffer) throw 'Failed to create vertex buffer';
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indices, gl.STATIC_DRAW);

    this._indexBuffer = iBuffer;
    this._vertexBuffer = vBuffer;
    this._shader = createRectShader(gl);
  }

  draw(rect: Rectangle): void {
    const gl = this._gl;

    rect._update();

    gl.useProgram(this._shader.program);
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

    if (rect.texture) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, rect.texture);
      gl.uniform1i(this._shader.uSamplerLoc, 0);
    }

    gl.uniform4f(
      this._shader.uColorLoc,
      rect.color[0],
      rect.color[1],
      rect.color[2],
      rect.color[3],
    );
    gl.uniformMatrix3fv(this._shader.uModelLoc, false, rect._mMatrix);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    gl.disableVertexAttribArray(0);
    gl.disableVertexAttribArray(1);
  }
}
