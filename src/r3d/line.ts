import { vec4 } from "gl-matrix";
import { colorFromInteger } from "./utility";

export class Line {
  _data: Float32Array;
  thickness: number;
  rgba: vec4;

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color = 0xffffff,
    thickness = 1,
    z = 0
  ) {
    x1 = x1 * 2 - 1;
    x2 = x2 * 2 - 1;
    y1 = 1 - y1 * 2;
    y2 = 1 - y2 * 2;
    this._data = new Float32Array([x1, y1, z, x2, y2, z]);
    this.thickness = thickness;

    this.rgba = colorFromInteger(color);
    this.rgba[0] /= 255;
    this.rgba[1] /= 255;
    this.rgba[2] /= 255;
    this.rgba[3] /= 255;
  }

  setPoints(x1: number, y1: number, x2: number, y2: number): void {
    x1 = x1 * 2 - 1;
    x2 = x2 * 2 - 1;
    y1 = 1 - y1 * 2;
    y2 = 1 - y2 * 2;

    this._data[0] = x1;
    this._data[1] = y1;
    this._data[3] = x2;
    this._data[4] = y2;
  }

  setColor(color: number): void {
    this.rgba = colorFromInteger(color);
  }

  setDepth(value: number): void {
    this._data[2] = value;
    this._data[5] = value;
  }
}
