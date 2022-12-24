import { Entity3D } from './entity3d';

export class Drawable3D extends Entity3D {
  gl: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext) {
    super();
    this.gl = gl;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  draw(_gl: WebGL2RenderingContext): void {
    //
  }
}
