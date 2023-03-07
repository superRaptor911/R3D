import { mat3, vec2, vec4 } from "gl-matrix";

export class Rectangle {
  _width = 1;
  _height = 1;

  texture: WebGLTexture | null = null;
  color: vec4;
  _x = 0;
  _y = 0;

  _mMatrix = mat3.create();

  _isDirty = true;

  constructor(x = 0, y = 0, width = 1, height = 1) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this.color = vec4.create();
    this._update();
  }

  setColor(r: number, g: number, b: number, a = 1): void {
    this.color[0] = r;
    this.color[1] = g;
    this.color[2] = b;
    this.color[3] = a;
  }

  _update(): void {
    if (!this._isDirty) return;

    const x = this._x * 2 - 1;
    const y = this._y * 2 - 1;

    const w = this._width * 2;
    const h = this._height * 2;

    const scale = mat3.create();
    const trans = mat3.create();

    mat3.fromScaling(scale, vec2.fromValues(w, h));
    mat3.fromTranslation(trans, vec2.fromValues(x, y));
    mat3.multiply(this._mMatrix, trans, scale);
    // mat3.multiply(this._mMatrix, scale, trans);
    this._isDirty = false;
  }
}
