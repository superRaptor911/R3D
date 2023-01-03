import { Camera3D } from './camera3d';
import { MeshNode, Model } from './model';
import { createDefaultShader, IDefaultShader } from './shaders/defaultShader';
import * as gltf from '@super_raptor911/webgl-gltf';
import { mat4, vec3 } from 'gl-matrix';
import { createSkinShader, ISkinShader } from './shaders/skinShader';

export class ModelRenderer {
  camera: Camera3D;
  gl: WebGL2RenderingContext;
  defaultShader: IDefaultShader;
  skinShader: ISkinShader;

  lightDir = vec3.fromValues(1, 0, 0);

  constructor(
    gl: WebGL2RenderingContext,
    camera: Camera3D,
    lightDir = vec3.fromValues(1, 1, 0),
  ) {
    this.camera = camera;
    this.gl = gl;
    this.defaultShader = createDefaultShader(gl);
    this.skinShader = createSkinShader(gl);
    this.setLightDir(lightDir);
  }

  setLightDir(dir: vec3): void {
    vec3.normalize(this.lightDir, dir);
    this.gl.useProgram(this.defaultShader.program);
    this.gl.uniform3f(
      this.defaultShader.uLightDirLoc,
      this.lightDir[0],
      this.lightDir[1],
      this.lightDir[2],
    );

    this.gl.useProgram(this.skinShader.program);
    this.gl.uniform3f(
      this.skinShader.uLightDirLoc,
      this.lightDir[0],
      this.lightDir[1],
      this.lightDir[2],
    );
  }

  drawMesh(mesh: gltf.Mesh, transform: mat4): void {
    const gl = this.gl;
    const shader = this.defaultShader;

    gl.useProgram(shader.program);
    // set positions
    gl.enableVertexAttribArray(0);
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positions.buffer);
    gl.vertexAttribPointer(
      shader.aPositions,
      mesh.positions.size,
      mesh.positions.type,
      false,
      0,
      0,
    );

    // set normals
    if (mesh.normals !== null) {
      gl.enableVertexAttribArray(1);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normals.buffer);
      gl.vertexAttribPointer(
        shader.aNormals,
        mesh.normals.size,
        mesh.normals.type,
        false,
        0,
        0,
      );
    }

    // set texture coordinates
    if (mesh.texCoord !== null) {
      gl.enableVertexAttribArray(2);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.texCoord.buffer);
      gl.vertexAttribPointer(
        shader.aTexCord,
        mesh.texCoord.size,
        mesh.texCoord.type,
        false,
        0,
        0,
      );
    }

    // set mvp uniform
    // prettier-ignore
    gl.uniformMatrix4fv(shader.mMatrixLoc, false, transform);

    if (mesh.indices) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indices);
      gl.drawElements(gl.TRIANGLES, mesh.elementCount, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(gl.TRIANGLES, 0, mesh.elementCount);
    }

    gl.disableVertexAttribArray(0);
    gl.disableVertexAttribArray(1);
    gl.disableVertexAttribArray(2);
  }

  drawNodes(model: gltf.Model, meshNode: MeshNode, transform: mat4): void {
    const newTransform = mat4.create();
    mat4.multiply(newTransform, transform, meshNode.mMatrix);

    if (meshNode.node.mesh !== undefined) {
      const id = meshNode.node.mesh;
      const mesh = model.meshes[id];
      this.drawMesh(mesh, newTransform);
    }

    meshNode.children.forEach((childNode) => {
      this.drawNodes(model, childNode, newTransform);
    });
  }

  draw(model: Model): void {
    if (!model._rootNode) return;

    this.gl.useProgram(this.defaultShader.program);
    this.gl.uniformMatrix4fv(
      this.defaultShader.vMatrixLoc,
      false,
      this.camera.vMatrix,
    );
    this.gl.uniformMatrix4fv(
      this.defaultShader.pMatrixLoc,
      false,
      this.camera.pMatrix,
    );

    this.drawNodes(model._gltfModel, model._rootNode, model.mMatrix);
  }
}
