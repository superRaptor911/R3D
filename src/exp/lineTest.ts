import { Line } from "../r3d/line";
import { LineRenderer } from "../r3d/lineRenderer";

export const lineTest = (gl: WebGL2RenderingContext): void => {
  const renderer = new LineRenderer(gl);
  const line = new Line(0, 0, 0.5, 1, 0x000000);
  line.setPoints(0, 0.5, 1, 0.5);

  const render = (): void => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderer.draw(line);
    requestAnimationFrame(render);
  };

  // Render
  render();
};
