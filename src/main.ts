// import { basic3dQuad } from "./exp/3d";
// import { gltfTest } from "./exp/gltfTest";
// import { lineTest } from "./exp/lineTest";
import { modelTest } from "./exp/modelTest";
// import { skinExperiment } from "./exp/skin";

// const renderTest = async (gl: WebGL2RenderingContext): Promise<void> => {
//   const model = (await loadObjModel(
//     gl,
//     'build/assets/models/untitled.obj',
//   )) as MeshWithBuffers;

//   const img = await loadImage('build/assets/images/tank.jpg');
//   const tex = createTextureFromImage(gl, img);

//   const obj = new Object3D(gl, model);
//   const obj2 = new Object3D(gl, model);
//   const cam = new Camera3D();

//   cam.translateZ(2);

//   obj2.translateY(-3);
//   obj2.translateZ(1);
//   obj.addChild(obj2);

//   const rect = new Rectangle(1, 0.2, -0.7, 0.7);
//   const rectRenderer = new RectRenderer(gl);
//   rect.texture = tex;
//   // rect.setColor(1, 1, 1);
//   const loop = (): void => {
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//     obj.rotateZ(0.01);
//     // cam.rotateY(0.01);
//     // console.log(cam.mMatrix);

//     rectRenderer.draw(rect);
//     obj.render(cam);
//     requestAnimationFrame(loop);
//   };

//   loop();
// };

const main = async (): Promise<void> => {
  const canvas = document.getElementById("game") as HTMLCanvasElement;
  if (!canvas) {
    console.error("main::Failed to get canvas");
    return;
  }

  canvas.width = 1336;
  canvas.height = 768;

  const gl = canvas.getContext("webgl2");
  if (!gl) {
    console.error("main::Failed to get webgl2 context");
    return;
  }
  gl.clearColor(0.3, 0.3, 0.3, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  // gl.depthFunc(gl.GREATER);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // renderTest(gl);
  // basic3dQuad(gl);
  // skinExperiment(gl);
  // gltfTest(gl);
  modelTest(gl);
  // bonesTest(gl);
  // lineTest(gl);
};

main();
