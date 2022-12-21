import { mat4 } from 'gl-matrix';

export class Camera3D {
  pMatrix = mat4.create();
  vMatrix = mat4.create();

  constructor() {
    mat4.perspective(this.pMatrix, 45.0, 400 / 300, 0.1, 100.0);
  }
}
