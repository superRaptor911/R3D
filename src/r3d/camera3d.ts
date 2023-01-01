import { mat4 } from 'gl-matrix';
import { Entity3D } from './entity3d';
import { toRadians } from './utility';

export class Camera3D extends Entity3D {
  pMatrix = mat4.create();
  _vMatrix = mat4.create();
  constructor(fov = 75, aspect = 1.7777777) {
    super();
    mat4.perspective(this.pMatrix, toRadians(fov), aspect, 0.1, 100.0);
    this.translateZ(3);
  }

  get vMatrix(): mat4 {
    mat4.invert(this._vMatrix, this.mMatrix);
    return this._vMatrix;
  }
}
