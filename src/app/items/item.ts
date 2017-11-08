export class Item {
  constructor(
    private _name: string,
    private _activeStates: Array<boolean>,
    private _images: Array<string>,
  ) {
    this._state = 0;
  }

  private _state: number;

  get name(): string {
    return this._name;
  }

  get activeStates(): Array<boolean> {
    return this._activeStates;
  }

  get images(): Array<string> {
    return this._images;
  }

  get stateCount(): number {
    return this._activeStates.length;
  }

  get state(): number {
    return this._state;
  }

  set state(state: number) {
    this._state = state;
  }

  get isActive(): boolean {
    return this._activeStates[this._state];
  }

  get image(): string {
    return this._images[this._state];
  }
}
