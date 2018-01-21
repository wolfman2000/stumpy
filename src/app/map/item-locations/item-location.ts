import { LocationType } from '../location-type';

export class ItemLocation {
  constructor(
    private _name: string,
    private _requirements: string,
    private _locationType: LocationType,
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

  get locationType(): LocationType {
    return this._locationType;
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

  isOutside(): boolean {
    return this._locationType === LocationType.Outside;
  }

  isInPit(): boolean {
    return this._locationType === LocationType.Pit;
  }

  isInSingleEntranceCave(): boolean {
    return this._locationType === LocationType.Single;
  }

  isInMultipleEntranceCave(): boolean {
    return this._locationType === LocationType.Multiple;
  }
}
