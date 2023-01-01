import { initMeshBuffers, Mesh, MeshWithBuffers } from 'webgl-obj-loader';

export const loadObjModel = async (
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

export const createOBJMesh = (
  gl: WebGL2RenderingContext,
  objData: string,
): MeshWithBuffers => {
  const mesh = new Mesh(objData);
  initMeshBuffers(gl, mesh);
  return mesh as MeshWithBuffers;
};

export const toRadians = (angle: number): number => {
  return (Math.PI * angle) / 180.0;
};
