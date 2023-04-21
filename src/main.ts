import { bonesTest } from "./exp/bonesTest";
import { skinExperiment } from "./exp/skin";

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
  // modelTest(gl);
  bonesTest(gl);
  // lineTest(gl);
  // rectangleTest(gl);
};

main();
