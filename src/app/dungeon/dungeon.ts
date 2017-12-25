import { EntranceLock } from './entrance-lock';
import { Location } from './location';
import { Reward } from './reward';

export class Dungeon {
  constructor(
    private _location: Location,
    private _dungeonAbbr: string,
    private _dungeonName: string,
    private _bossName: string,
    private _reward: Reward,
    private _maxItemChests: number,
    private _entranceLock: EntranceLock = EntranceLock.None
  ) {
    this._itemChestCount = this._maxItemChests;
    this._bossId = this._location;
    this._isBossDefeated = false;
    this._hasBigKey = false;
  }

  private _bossId: Location;
  private _itemChestCount: number;
  private _isBossDefeated: boolean;
  private _hasBigKey: boolean;

  get location(): Location {
    return this._location;
  }
  get dungeonAbbr(): string {
    return this._dungeonAbbr;
  }
  get dungeonName(): string {
    return this._dungeonName;
  }
  get bossName(): string {
    return this._bossName;
  }
  get maxItemChests(): number {
    return this._maxItemChests;
  }
  get itemChestCount(): number {
    return this._itemChestCount;
  }
  get hasBigKey(): boolean {
    return this._hasBigKey;
  }
  get bossId(): Location {
    return this._bossId;
  }
  get entranceLock(): EntranceLock {
    return this._entranceLock;
  }
  get isBossDefeated(): boolean {
    return this._isBossDefeated;
  }
  get reward(): Reward {
    return this._reward;
  }
  get hasDungeonEndingReward(): boolean {
    return this.reward !== Reward.None;
  }

  get hasMedallionEntrance(): boolean {
    return this.entranceLock !== EntranceLock.None;
  }

  decrementChestCount(): void {
    this._itemChestCount = (this.itemChestCount === 0) ? this.maxItemChests : this.itemChestCount - 1;
  }
  cycleEntranceLock(): void {
    switch ( this.entranceLock ) {
      case EntranceLock.Unknown:
        this._entranceLock = EntranceLock.Bombos;
        break;
      case EntranceLock.Bombos:
        this._entranceLock = EntranceLock.Ether;
        break;
      case EntranceLock.Ether:
        this._entranceLock = EntranceLock.Quake;
        break;
      case EntranceLock.Quake:
        this._entranceLock = EntranceLock.Unknown;
        break;
      default:
        break;
    }
  }

  cycleReward(): void {
    switch ( this.reward ) {
      case Reward.Unknown:
        this._reward = Reward.GreenPendant;
        break;
      case Reward.GreenPendant:
        this._reward = Reward.StandardPendant;
        break;
      case Reward.StandardPendant:
        this._reward = Reward.StandardCrystal;
        break;
      case Reward.StandardCrystal:
        this._reward = Reward.FairyCrystal;
        break;
      case Reward.FairyCrystal:
        this._reward = Reward.Unknown;
        break;
    }
  }

  toggleDefeat(): void {
    this._isBossDefeated = !this.isBossDefeated;
  }

  toggleBigKey(): void {
    this._hasBigKey = !this._hasBigKey;
  }

  reset(): void {
    this._itemChestCount = this.maxItemChests;
    this._isBossDefeated = false;
    this._bossId = this._location;
    this._hasBigKey = false;
    if ( this._reward !== Reward.None ) {
      this._reward = Reward.Unknown;
    }
    if ( this.entranceLock !== EntranceLock.None ) {
      this._entranceLock = EntranceLock.Unknown;
    }
  }
}
