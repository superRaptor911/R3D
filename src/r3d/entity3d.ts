import { mat4, quat, quat2, vec3 } from 'gl-matrix';

export class Entity3D {
  mMatrix = mat4.create();
  quat = quat2.create();
  x = 0;
  y = 0;
  z = 0;

  rotX = 0;
  rotY = 0;
  rotZ = 0;

  _isDirty = false;

  constructor() {
    //
  }

  setPosition(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
    this._isDirty = true;
  }

  setRotation(x: number, y: number, z: number): void {
    this.rotX = x;
    this.rotY = y;
    this.rotZ = z;
    console.error('entity3d::not implemented');
  }

  rotateX(rad: number): void {
    quat2.rotateX(this.quat, this.quat, rad);
    this.rotX += rad;
    this._isDirty = true;
  }

  rotateY(rad: number): void {
    quat2.rotateY(this.quat, this.quat, rad);
    this.rotY += rad;
    this._isDirty = true;
  }

  rotateZ(rad: number): void {
    quat2.rotateZ(this.quat, this.quat, rad);
    this.rotZ += rad;
    this._isDirty = true;
  }

  translateX(val: number): void {
    quat2.translate(this.quat, this.quat, vec3.fromValues(val, 0, 0));
    this.x += val;
    this._isDirty = true;
  }

  translateY(val: number): void {
    quat2.translate(this.quat, this.quat, vec3.fromValues(0, val, 0));
    this.y += val;
    this._isDirty = true;
  }

  translateZ(val: number): void {
    quat2.translate(this.quat, this.quat, vec3.fromValues(0, 0, val));
    this.z += val;
    this._isDirty = true;
  }

  translate(x: number, y: number, z: number): void {
    quat2.translate(this.quat, this.quat, vec3.fromValues(x, y, z));
    this._isDirty = true;
  }

  _update(): void {
    if (!this._isDirty) return;
    mat4.fromQuat2(this.mMatrix, this.quat);
    this._isDirty = false;
  }
}
