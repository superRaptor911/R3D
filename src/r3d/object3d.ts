import { mat4 } from 'gl-matrix';
import { MeshWithBuffers } from 'webgl-obj-loader';

export class Object3D {
  mMatrix = mat4.create();
  mesh: MeshWithBuffers;

  constructor(model: MeshWithBuffers) {
    this.mesh = model;
  }
}
