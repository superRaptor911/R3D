import { Renderer3D } from './renderer3d';

export class Renderer {
  gl: WebGL2RenderingContext;
  renderer3d: Renderer3D;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.renderer3d = new Renderer3D(gl);
  }
}
