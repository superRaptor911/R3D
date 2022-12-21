import { createWebGLProgram } from './r3d/shaders';
import { loadModel } from './r3d/models';
import { Mesh, MeshWithBuffers } from 'webgl-obj-loader';
import { mat4, vec3 } from 'gl-matrix';
import { Renderer3D } from './r3d/renderer3d';
import { Object3D } from './r3d/object3d';
import { Camera3D } from './r3d/camera3d';

const main = async (): Promise<void> => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  if (!canvas) {
    console.error('main::Failed to get canvas');
    return;
  }

  canvas.width = 1280;
  canvas.height = 720;

  const gl = canvas.getContext('webgl2');
  if (!gl) {
    console.error('main::Failed to get webgl2 context');
    return;
  }
  gl.clearColor(0.3, 0.3, 0.3, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  const model = (await loadModel(
    gl,
    'build/assets/models/untitled.obj',
  )) as MeshWithBuffers;

  console.log(model);
  render(gl, model);
};

main();

const render = (gl: WebGL2RenderingContext, model: MeshWithBuffers): void => {
  const render = new Renderer3D(gl);
  const obj = new Object3D(model);
  const cam = new Camera3D();

  // cam.translateY(2);

  const loop = (): void => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enableVertexAttribArray(0);

    // obj.rotateY(0.01);
    // cam.rotateY(0.01);
    // console.log(cam.mMatrix);

    render.render(obj, cam);
    requestAnimationFrame(loop);
  };

  loop();
};
