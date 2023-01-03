import * as gltf from '@super_raptor911/webgl-gltf';
import { mat4 } from 'gl-matrix';
import { Entity3D } from './entity3d';

export class Node extends Entity3D {
  node: gltf.Node;
  children: Node[] = [];

  constructor(node: gltf.Node) {
    super();
    this.node = node;
    this.fromTransform(node.localBindTransform);
  }
}

export class Skeleton {
  boneID: number;
  skeletons: Skeleton[] = [];
  ibt: mat4;

  constructor(boneID: number, ibt: mat4) {
    this.boneID = boneID;
    this.ibt = ibt;
  }
}

export class Model extends Entity3D {
  _gltfModel: gltf.Model;

  _rootNode: Node | null = null;

  _skeleton: Skeleton | null = null;
  _boneMatrices: mat4[] = [];
  _bonesModified = true;
  bones: Node[] = [];

  constructor(gltfModel: gltf.Model) {
    super();
    this._gltfModel = gltfModel;
    this._setupNodes();
  }

  _setupNodesRecursive(meshNodes: Node[], target: Node): void {
    target.node.children.forEach((nodeID) => {
      const childNode = meshNodes[nodeID];
      this._setupNodesRecursive(meshNodes, childNode);
      target.addChild(childNode);
    });
  }

  _setupNodes(): void {
    const m = this._gltfModel;
    // const record: Record<number, boolean> = {};
    const meshNodes = m.nodes.map((node) => {
      return new Node(node);
    });

    this._rootNode = meshNodes[m.rootNode];
    this._setupNodesRecursive(meshNodes, this._rootNode);

    // setup bones
    if (m.skins.length > 0) {
      const skin = m.skins[0];
      this.bones = skin.joints.map((jointID) => {
        this._boneMatrices.push(mat4.create());
        return meshNodes[jointID];
      });

      if (this.bones.length > 0) {
        const skeleton = new Skeleton(0, skin.inverseBindTransforms[0]);
        this._skeleton = skeleton;
        this._setupSkeleton(skeleton, 0);
        this.computeBoneMatrices();
        this._printSkeletonStructure();
      }
    }
  }

  _setupSkeleton(skeleton: Skeleton, id: number): void {
    const skin = this._gltfModel.skins[0];
    for (let i = id + 1; i < this.bones.length; i++) {
      if (this.bones[i].parent == this.bones[id]) {
        const newSkeleton = new Skeleton(i, skin.inverseBindTransforms[i]);
        this._setupSkeleton(newSkeleton, i);
        skeleton.skeletons.push(newSkeleton);
      }
    }
  }

  _printSkeletonStructure(level = 0, skeleton?: Skeleton): void {
    const s = skeleton || this._skeleton;
    if (s) {
      const bone = this.bones[s.boneID];
      console.log('-'.repeat(level), bone.node.name);
      s.skeletons.forEach((sc) => this._printSkeletonStructure(level + 1, sc));
    }
  }

  _computeSkeletonMatrix(s: Skeleton, transform: mat4): void {
    const newTransform = this._boneMatrices[s.boneID];
    mat4.multiply(newTransform, transform, this.bones[s.boneID].mMatrix);
    s.skeletons.forEach((sc) => this._computeSkeletonMatrix(sc, newTransform));
    mat4.multiply(newTransform, newTransform, s.ibt);
  }

  computeBoneMatrices(): void {
    if (!this._bonesModified || !this._skeleton) return;
    this._computeSkeletonMatrix(this._skeleton, mat4.create());
    this._bonesModified = false;
  }
}
