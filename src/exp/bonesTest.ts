import * as gltf from "@super_raptor911/webgl-gltf";
import { mat4 } from "gl-matrix";
import { Camera3D } from "../r3d/camera3d";
import { Model } from "../r3d/model";
import { ModelRenderer } from "../r3d/modelRenderer";

export const bonesTest = async (gl: WebGL2RenderingContext): Promise<void> => {
  // const mdl = await gltf.loadModel(gl, "models/robot.gltf");
  const mdl = await gltf.loadModel(gl, "models/base/human.gltf");
  const model = new Model(mdl);

  const camera = new Camera3D();
  const renderer = new ModelRenderer(gl, camera);

  camera.translateZ(3);
  camera.translateY(1);
  const bone = model.bones[3];

  mat4.invert(bone.wMatrix, bone.wMatrix);
  bone.setRotation(0, 0, 0);
  bone.setPosition(2, 2, 0);
  mat4.multiply(bone.mMatrix, bone.wMatrix, bone.mMatrix);
  model._bonesModified = true;

  // model.setScale(2, 2, 2);
  const render = (): void => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    model.rotateY(0.005);
    // bone.rotateZ(0.005);

    // bone.setPosition(6, 0, 0);
    // model._bonesModified = true;
    renderer.draw(model);

    requestAnimationFrame(render);
  };

  // Render
  render();
};
