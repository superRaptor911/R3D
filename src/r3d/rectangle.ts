export class Rectangle {
  static _vertices = new Float32Array([
    -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5,
  ]);
  static _vertexBuffer: WebGLBuffer | null = null;

  width = 1;
  height = 1;

  texture: WebGLTexture | null = null;
  x = 0;
  y = 0;

  _gl: WebGL2RenderingContext | null = null;

  constructor(gl: WebGL2RenderingContext, x = 0, y = 0, width = 1, height = 1) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this._gl = gl;

    if (!Rectangle._vertexBuffer) {
      Rectangle._vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, Rectangle._vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, Rectangle._vertices, gl.STATIC_DRAW);
    }
  }

  draw(): void {}
}
