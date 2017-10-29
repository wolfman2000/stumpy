export class World {
  constructor(
    private _name: string,
    private _itemLocationIds: Array<number>,
    private _dungeonLocationIds: Array<number>
  ) {}

  get name(): string {
    return this._name;
  }

  get itemLocationIds(): Array<number> {
    return this._itemLocationIds;
  }

  get dungeonLocationIds(): Array<number> {
    return this._dungeonLocationIds;
  }
}
