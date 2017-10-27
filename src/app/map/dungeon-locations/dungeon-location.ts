export class DungeonLocation {
  constructor(
    private _name: string,
    private _requirements: string,
    private _left: number,
    private _top: number
  ) {}

  get name(): string {
    return this._name;
  }

  get requirements(): string {
    return this._requirements;
  }

  get left(): number {
    return this._left;
  }

  get top(): number {
    return this._top;
  }
}
