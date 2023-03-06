import * as gltf from "@super_raptor911/webgl-gltf";
import { Camera3D } from "../r3d/camera3d";
import { Model } from "../r3d/model";
import { ModelRenderer } from "../r3d/modelRenderer";

export const modelTest = async (gl: WebGL2RenderingContext): Promise<void> => {
  const mdl = await gltf.loadModel(gl, "models/sweater/dress.gltf");
  const model = new Model(mdl);

  const camera = new Camera3D();
  const renderer = new ModelRenderer(gl, camera);

  // camera.translateZ(10);
  camera.translateZ(5);
  camera.translateY(3);
  // camera.translateY(-5);
  console.log(model);
  // model.setScale(0.1, 0.1, 0.1);
  // model.setScale(2, 2, 2);
  const render = (): void => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // model.rotateX(0.001);
    model.rotateY(0.01);

    // model.bones[2].rotateX(0.001);
    // model._bonesModified = true;
    // model.computeBoneMatrices();
    renderer.draw(model);

    requestAnimationFrame(render);
  };

  // Render
  render();
};
