import { vec2 } from 'gl-matrix';
import { createLineShader, ILineShader } from './shaders/lineShader';
import { colorFromInteger } from './utility';

export class LineRenderer {
  gl: WebGL2RenderingContext;
  _shader: ILineShader;

  _vertexBuffer: WebGLBuffer;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this._shader = createLineShader(gl);

    const vBuffer = gl.createBuffer();
    if (!vBuffer) throw 'Failed to create vertex buffer';

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, null, gl.DYNAMIC_DRAW);
    this._vertexBuffer = vBuffer;
  }

  _draw(data: Float32Array, color: number, thickness: number): void {
    const gl = this.gl;
    gl.lineWidth(thickness);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);

    gl.useProgram(this._shader.program);
    gl.enableVertexAttribArray(this._shader.aPosLoc);
    gl.vertexAttribPointer(this._shader.aPosLoc, 3, gl.FLOAT, false, 0, 0);

    const rgba = colorFromInteger(color);
    gl.uniform4f(this._shader.uColorLoc, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.drawArrays(gl.LINES, 0, data.length / 2);
    gl.disableVertexAttribArray(this._shader.aPosLoc);
  }

  draw(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: number,
    thickness = 1,
  ): void {
    const data = new Float32Array([x1, y1, 0, x2, y2, 0]);
    this._draw(data, color, thickness);
  }

  drawLines(lines: vec2[][], color: number, thickness = 1): void {
    const array: number[] = [];
    lines.forEach((points) => {
      const point1 = points[0];
      for (let i = 1; i < points.length; i++) {
        const point2 = points[i];
        array.push(point1[0], point1[1]);
        array.push(point2[0], point2[1]);
      }
    });

    const data = new Float32Array(array);
    this._draw(data, color, thickness);
  }
}
