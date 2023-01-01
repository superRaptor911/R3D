import { Entity3D } from './entity3d';

export class Drawable3D extends Entity3D {
  gl: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext) {
    super();
    this.gl = gl;
  }
}
