import { MeshWithBuffers } from 'webgl-obj-loader';
import { Entity3D } from './entity3d';

export class Object3D extends Entity3D {
  mesh: MeshWithBuffers;
  constructor(model: MeshWithBuffers) {
    super();
    this.mesh = model;
  }

  render(gl: WebGL2RenderingContext): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
    gl.vertexAttribPointer(
      0,
      this.mesh.vertexBuffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0,
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
    gl.drawElements(
      gl.TRIANGLES,
      this.mesh.indexBuffer.numItems,
      gl.UNSIGNED_SHORT,
      0,
    );
  }
}
