import * as gltf from '@super_raptor911/webgl-gltf';
import { Camera3D } from '../r3d/camera3d';
import { Model } from '../r3d/model';
import { ModelRenderer } from '../r3d/modelRenderer';

export const modelTest = async (gl: WebGL2RenderingContext): Promise<void> => {
  // fetch('build/assets/models/untitled.gltf').then((res) =>
  //   res.json().then((ans) => console.log(ans)),
  // );
  const mdl = await gltf.loadModel(gl, 'build/assets/models/untitled.gltf');
  const model = new Model(mdl);

  const camera = new Camera3D();
  const renderer = new ModelRenderer(gl, camera);

  camera.translateZ(0);
  camera.translateY(1);
  console.log(model);
  const render = (): void => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // model.rotateX(0.001);
    model.rotateY(0.001);
    renderer.draw(model);

    requestAnimationFrame(render);
  };

  // Render
  render();
};
