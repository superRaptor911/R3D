import { vec4 } from "gl-matrix";
import { Line } from "./line";
import { createLineShader, ILineShader } from "./shaders/lineShader";

export class LineRenderer {
  gl: WebGL2RenderingContext;
  _shader: ILineShader;

  _vertexBuffer: WebGLBuffer;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this._shader = createLineShader(gl);

    const vBuffer = gl.createBuffer();
    if (!vBuffer) throw "Failed to create vertex buffer";

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 4 * 128, gl.DYNAMIC_DRAW);
    this._vertexBuffer = vBuffer;
  }

  _draw(data: Float32Array, color: vec4, thickness: number): void {
    const gl = this.gl;
    gl.lineWidth(thickness);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);

    gl.useProgram(this._shader.program);
    gl.enableVertexAttribArray(this._shader.aPosLoc);
    gl.vertexAttribPointer(this._shader.aPosLoc, 3, gl.FLOAT, false, 0, 0);

    gl.uniform4f(
      this._shader.uColorLoc,
      color[0],
      color[1],
      color[2],
      color[3]
    );
    gl.drawArrays(gl.LINES, 0, data.length / 2);
    gl.disableVertexAttribArray(this._shader.aPosLoc);
  }

  draw(line: Line): void {
    this._draw(line._data, line.rgba, line.thickness);
  }

  // drawLines(lines: vec2[][], color: number, thickness = 1) {
  //   const array: number[] = [];
  //   lines.forEach((points) => {
  //     const point1 = points[0];
  //     for (let i = 1; i < points.length; i++) {
  //       const point2 = points[i];
  //       array.push(point1[0], point1[1]);
  //       array.push(point2[0], point2[1]);
  //     }
  //   });

  //   // const data = new Float32Array(array);
  //   // this._draw(data, color, thickness);
  // }
}
