import * as gltf from "@super_raptor911/webgl-gltf";
import { mat4 } from "gl-matrix";
import { Entity3D } from "./entity3d";

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

  _skeletons: Skeleton[] = [];
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
    const mdl = this._gltfModel;
    const meshNodes = mdl.nodes.map((node) => {
      return new Node(node);
    });

    this._rootNode = meshNodes[mdl.rootNode];
    this._setupNodesRecursive(meshNodes, this._rootNode);

    // setup bones
    if (mdl.skins.length > 0) {
      const skin = mdl.skins[0];

      console.log(skin);
      this.bones = skin.joints.map((jointID) => {
        this._boneMatrices.push(mat4.create());
        return meshNodes[jointID];
      });

      if (this.bones.length > 0) {
        let boneID = 0;

        while (boneID < this.bones.length) {
          const skeleton = new Skeleton(
            boneID,
            skin.inverseBindTransforms[boneID]
          );
          boneID = this._setupSkeleton(skeleton, boneID);
          this._skeletons.push(skeleton);
        }

        this.computeBoneMatrices();
        this._printSkeletonStructure();
      }
    }
  }

  _setupSkeleton(skeleton: Skeleton, id: number): number {
    let nextId = id + 1;
    const skin = this._gltfModel.skins[0];
    for (let i = id + 1; i < this.bones.length; i++) {
      if (this.bones[i].parent == this.bones[id]) {
        const newSkeleton = new Skeleton(i, skin.inverseBindTransforms[i]);
        nextId = this._setupSkeleton(newSkeleton, i);
        skeleton.skeletons.push(newSkeleton);
      }
    }
    return nextId;
  }

  _printSkeletonStructure(level = 0, skeleton?: Skeleton): void {
    if (skeleton) {
      const bone = this.bones[skeleton.boneID];
      console.log("-".repeat(level), bone.node.name);
      skeleton.skeletons.forEach((sc) =>
        this._printSkeletonStructure(level + 1, sc)
      );
    } else {
      this._skeletons.forEach((skeleton) =>
        this._printSkeletonStructure(0, skeleton)
      );
    }
  }

  _computeSkeletonMatrix(s: Skeleton, transform: mat4): void {
    mat4.copy(this.bones[s.boneID].wMatrix, transform);
    const newTransform = this._boneMatrices[s.boneID];
    mat4.multiply(newTransform, transform, this.bones[s.boneID].mMatrix);
    s.skeletons.forEach((sc) => this._computeSkeletonMatrix(sc, newTransform));
    mat4.multiply(newTransform, newTransform, s.ibt);
  }

  computeBoneMatrices(): void {
    if (!this._bonesModified || !this._skeletons) return;
    this._skeletons.forEach((skeleton) =>
      this._computeSkeletonMatrix(skeleton, mat4.create())
    );
    this._bonesModified = false;
  }
}
