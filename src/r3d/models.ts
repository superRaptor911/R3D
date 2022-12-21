import { initMeshBuffers, Mesh, MeshWithBuffers } from 'webgl-obj-loader';

export const loadModel = async (
  gl: WebGL2RenderingContext,
  path: string,
  init = true,
): Promise<Mesh | MeshWithBuffers> => {
  const response = await fetch(path);
  const text = await response.text();

  const mesh = new Mesh(text);
  if (init) {
    initMeshBuffers(gl, mesh);
  }
  return mesh;
};
