const vShaderSource = `#version 300 es
in vec2 aPos;
in vec3 aClr;

out vec3 vClr;

void main() {
    gl_Position  = vec4(aPos, 0.0, 1.0);
    gl_PointSize = 50.0;
    vClr = aClr;
}
`;

const fShaderSource = `#version 300 es
precision mediump float;

out vec4 fragColor;
in vec3 vClr;

void main() {
    fragColor = vec4(vClr, 1.0);
}
`;

const createWebGLProgram = (
  gl: WebGL2RenderingContext,
  vSource: string,
  fSource: string,
): WebGLProgram | null => {
  const program = gl.createProgram();
  if (!program) {
    console.error('main::Failed to create program');
    return null;
  }

  const vShader = gl.createShader(gl.VERTEX_SHADER);
  if (!vShader) {
    console.error('main::Failed to create vertex shader');
    return null;
  }

  gl.shaderSource(vShader, vSource);
  gl.compileShader(vShader);
  gl.attachShader(program, vShader);

  const fShader = gl.createShader(gl.FRAGMENT_SHADER);
  if (!fShader) {
    console.error('main::Failed to create fragment shader');
    return null;
  }
  gl.shaderSource(fShader, fSource);
  gl.compileShader(fShader);
  gl.attachShader(program, fShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('main::Failed to link program');
    console.error('main::' + gl.getShaderInfoLog(vShader));
    console.error('main::' + gl.getShaderInfoLog(fShader));
  }

  return program;
};

const main = (): void => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  if (!canvas) {
    console.error('main::Failed to get canvas');
    return;
  }

  const gl = canvas.getContext('webgl2');
  if (!gl) {
    console.error('main::Failed to get webgl2 context');
    return;
  }

  const program = createWebGLProgram(gl, vShaderSource, fShaderSource)!;
  gl.useProgram(program);

  const bufferData = new Float32Array([0, 0, 1, 0, 0, 0.5, 0.5, 0, 1, 0]);

  const aPosLoc = gl.getAttribLocation(program, 'aPos');
  const aClrLoc = gl.getAttribLocation(program, 'aClr');

  gl.enableVertexAttribArray(aPosLoc);
  gl.enableVertexAttribArray(aClrLoc);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);

  gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 4 * 5, 0);
  gl.vertexAttribPointer(aClrLoc, 3, gl.FLOAT, false, 4 * 5, 2 * 4);

  gl.drawArrays(gl.POINTS, 0, 2);
};

main();

export {};
