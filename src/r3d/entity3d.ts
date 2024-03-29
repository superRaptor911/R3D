import { mat4, quat, vec3 } from "gl-matrix";
import { Entity } from "./entity";

export class Entity3D extends Entity {
  position = vec3.create();
  scale = vec3.fromValues(1, 1, 1);
  rotation = quat.create();
  wMatrix = mat4.create();

  _mMatrix = mat4.create();
  _isDirty = false;

  constructor() {
    super();
  }

  get mMatrix(): mat4 {
    this._update();
    return this._mMatrix;
  }

  setPosition(x: number, y: number, z: number): void {
    vec3.set(this.position, x, y, z);
    this._isDirty = true;
  }

  setRotation(x: number, y: number, z: number): void {
    const xAngle = (x * 180) / Math.PI;
    const yAngle = (y * 180) / Math.PI;
    const zAngle = (z * 180) / Math.PI;

    quat.fromEuler(this.rotation, xAngle, yAngle, zAngle);
    this._isDirty = true;
  }

  setScale(x: number, y: number, z: number): void {
    vec3.set(this.scale, x, y, z);
    this._isDirty = true;
  }

  rotateX(rad: number): void {
    quat.rotateX(this.rotation, this.rotation, rad);
    this._isDirty = true;
  }

  rotateY(rad: number): void {
    quat.rotateY(this.rotation, this.rotation, rad);
    this._isDirty = true;
  }

  rotateZ(rad: number): void {
    quat.rotateZ(this.rotation, this.rotation, rad);
    this._isDirty = true;
  }

  translateX(val: number): void {
    this.position[0] += val;
    this._isDirty = true;
  }

  translateY(val: number): void {
    this.position[1] += val;
    this._isDirty = true;
  }

  translateZ(val: number): void {
    this.position[2] += val;
    this._isDirty = true;
  }

  translate(x: number, y: number, z: number): void {
    this.position[0] += x;
    this.position[1] += y;
    this.position[2] += z;
    this._isDirty = true;
  }

  fromTransform(transform: mat4): void {
    mat4.copy(this._mMatrix, transform);
    mat4.getTranslation(this.position, transform);
    mat4.getRotation(this.rotation, transform);
    mat4.getScaling(this.scale, transform);
  }

  _update(): void {
    if (!this._isDirty) return;
    mat4.fromRotationTranslationScale(
      this._mMatrix,
      this.rotation,
      this.position,
      this.scale
    );
    this._isDirty = false;
  }
}
