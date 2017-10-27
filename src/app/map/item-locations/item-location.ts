export class ItemLocation {
  constructor(
    private _name: string,
    private _requirements: string,
    private _left: number,
    private _top: number
  ) {
  }

  private _isOpened: boolean;

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

  get isOpened(): boolean {
    return this._isOpened;
  }

  toggleOpened(): void {
    this._isOpened = !this.isOpened;
  }
}
