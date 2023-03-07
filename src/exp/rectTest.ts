import { Camera3D } from "../r3d/camera3d";
import { Rectangle } from "../r3d/rectangle";
import { RectRenderer } from "../r3d/rectRenderer";
import { createTextureFromMedia, loadImage } from "../r3d/textures";

export const rectangleTest = async (
  gl: WebGL2RenderingContext
): Promise<void> => {
  const img = await loadImage("images/tank.jpg");
  const tex = createTextureFromMedia(gl, img);

  const cam = new Camera3D();
  cam.translateZ(2);

  const rect = new Rectangle(0.0, 0, 0.5, 0.5);
  const rectRenderer = new RectRenderer(gl);
  rect.texture = tex;
  // rect.setColor(1, 1, 1);
  const loop = (): void => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    rectRenderer.draw(rect);
    requestAnimationFrame(loop);
  };

  loop();
};
