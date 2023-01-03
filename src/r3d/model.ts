import * as gltf from '@super_raptor911/webgl-gltf';
import { mat4 } from 'gl-matrix';
import { Entity3D } from './entity3d';

export class MeshNode extends Entity3D {
  node: gltf.Node;
  children: MeshNode[] = [];

  constructor(node: gltf.Node) {
    super();
    this.node = node;
    this.fromTransform(node.localBindTransform);
  }
}

export class Model extends Entity3D {
  _gltfModel: gltf.Model;

  _rootNode: MeshNode | null = null;

  _boneMatrices: mat4[] = [];

  bones: MeshNode[] = [];

  constructor(gltfModel: gltf.Model) {
    super();
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
    // const record: Record<number, boolean> = {};
    // const meshNodes = m.nodes.map((node, id) => {
    //   record[id] = false;
    //   return new MeshNode(node);
    // });

    // m.nodes.forEach((node, id) => {
    //   const meshNode = meshNodes[id];
    //   node.children.forEach((childID) => {
    //     meshNode.addChild(meshNodes[childID]);
    //     record[childID] = true;
    //   });
    // });

    // for (let i = 0; i < meshNodes.length; i++) {
    //   if (record[i]) {
    //     this._rootNode = meshNodes[i];
    //     break;
    //   }
    // }

    this._rootNode = new MeshNode(m.nodes[m.rootNode]);
    this._setupNodesRecursive(this._rootNode);
  }
}
