export class Entity {
  parent: Entity | null = null;
  children: Entity[] = [];

  constructor() {
    //
  }

  addChild(child: Entity): void {
    if (!child.parent) {
      child.parent = this;
      this.children.push(child);
    }
  }

  removeChild(child: Entity): void {
    if (child.parent == this) {
      child.parent = null;
      this.children = this.children.filter((item) => item != child);
    }
  }

  _update(): void {
    //
  }
}
