import { EntranceLock } from './entrance-lock';
import { Reward } from './reward';

export class Dungeon {
  constructor(
    private _dungeonName: string,
    private _bossName: string,
    private _reward: Reward,
    private _maxChests: number,
    private _entranceLock: EntranceLock = EntranceLock.None
  ) {
    this._chestCount = this._maxChests;
  }

  private _chestCount: number;
  private _isBossDefeated: boolean;

  get bossName(): string {
    return this._bossName;
  }
  get maxChests(): number {
    return this._maxChests;
  }
  get chestCount(): number {
    return this._chestCount;
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
    this._chestCount = (this.chestCount === 0) ? this.maxChests : this.chestCount - 1;
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

  reset(): void {
    this._chestCount = this.maxChests;
    this._isBossDefeated = false;
    if ( this._reward !== Reward.None ) {
      this._reward = Reward.Unknown;
    }
    if ( this.entranceLock !== EntranceLock.None ) {
      this._entranceLock = EntranceLock.Unknown;
    }
  }
}
