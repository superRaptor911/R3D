export const createTextureFromImage = (
  gl: WebGL2RenderingContext,
  image: HTMLImageElement,
): WebGLTexture | null => {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGB,
    image.width,
    image.height,
    0,
    gl.RGB,
    gl.UNSIGNED_BYTE,
    image,
  );

  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
};

export const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = '';
    image.onload = (): void => resolve(image);
    image.onerror = (): void => reject(null);
    image.src = src;
  });
