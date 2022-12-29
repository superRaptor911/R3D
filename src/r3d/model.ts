import { Drawable3D } from './drawable3d';
import * as gltf from 'webgl-gltf';
import { Entity3D } from './entity3d';
import { Camera3D } from './camera3d';

class MeshNode extends Entity3D {
  node: gltf.Node;
  children: MeshNode[] = [];

  constructor(node: gltf.Node) {
    super();
    this.node = node;
  }
}

export class Model extends Drawable3D {
  _gltfModel: gltf.Model;

  _nodes: MeshNode | null = null;

  constructor(gl: WebGL2RenderingContext, gltfModel: gltf.Model) {
    super(gl);
    this._gltfModel = gltfModel;
    this.setupNodes();
  }

  _setupNodesRecursive(target: MeshNode): void {
    target.node.children.forEach((nodeID) => {
      const node = this._gltfModel.nodes[nodeID];
      const childNode = new MeshNode(node);
      this._setupNodesRecursive(childNode);
      target.addChild(childNode);
    });
  }

  setupNodes(): void {
    const m = this._gltfModel;
    if (m.nodes.length > 0) {
      const meshNode = new MeshNode(m.nodes[0]);
      this._setupNodesRecursive(meshNode);
      this._nodes = meshNode;
    }
  }

  render(camera: Camera3D) {}
}
