import { vec4 } from 'gl-matrix';
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

export const integerFromColor = (
  r: number,
  g: number,
  b: number,
  a: number,
): number => {
  const color = (r << 24) + (g << 16) + (b << 8) + a;
  return color;
};

export const colorFromInteger = (c: number): vec4 => {
  const r = (c & 0xff000000) >> 24;
  const g = (c & 0x00ff0000) >> 16;
  const b = (c & 0x0000ff00) >> 8;
  const a = c & 0x000000ff;

  return vec4.fromValues(r, g, b, a);
};
