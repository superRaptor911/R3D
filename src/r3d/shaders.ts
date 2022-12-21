export const createWebGLProgram = (
  gl: WebGL2RenderingContext,
  vSource: string,
  fSource: string,
): WebGLProgram | null => {
  const program = gl.createProgram();
  if (!program) {
    console.error('shaders::Failed to create program');
    return null;
  }

  const vShader = gl.createShader(gl.VERTEX_SHADER);
  if (!vShader) {
    console.error('shaders::Failed to create vertex shader');
    return null;
  }

  gl.shaderSource(vShader, vSource);
  gl.compileShader(vShader);
  gl.attachShader(program, vShader);

  const fShader = gl.createShader(gl.FRAGMENT_SHADER);
  if (!fShader) {
    console.error('shaders::Failed to create fragment shader');
    return null;
  }
  gl.shaderSource(fShader, fSource);
  gl.compileShader(fShader);
  gl.attachShader(program, fShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('shaders::Failed to link program');
    console.error('shaders::vertex' + gl.getShaderInfoLog(vShader));
    console.error('shaders::fragment' + gl.getShaderInfoLog(fShader));
  }

  return program;
};
