import { LineRenderer } from '../r3d/lineRenderer';

export const lineTest = (gl: WebGL2RenderingContext): void => {
  const renderer = new LineRenderer(gl);
  const render = (): void => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderer.draw(0, 0, 1, 1, 0xff000000);
    requestAnimationFrame(render);
  };

  // Render
  render();
};
