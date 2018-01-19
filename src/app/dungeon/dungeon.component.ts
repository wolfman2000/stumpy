import { Component, Input, OnInit } from '@angular/core';

import { DungeonService } from './dungeon.service';
import { SettingsService } from '../settings/settings.service';

import { Dungeon } from './dungeon';
import { Reward } from './reward';
import { CamelCasePipe } from '../camel-case.pipe';

@Component({
  selector: 'stumpy-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.css']
})
export class DungeonComponent implements OnInit {
  constructor(
    private dungeonService: DungeonService,
    private _settings: SettingsService,
    private camelCasePipe: CamelCasePipe
  ) { }

  @Input()
  dungeonId: number;

  private dungeon: Dungeon;

  ngOnInit() {
    this.dungeon = this.dungeonService.getDungeon(this.dungeonId);
  }

  hasBigKey(): boolean {
    if ( !this._settings.isKeysanity() ) {
      return false;
    }

    return this.dungeonService.hasBigKey( this.dungeonId );
  }

  hasChests(): boolean {
    return this._settings.isKeysanity() || this.dungeon.maxItemChests > 0;
  }

  hasReward(): boolean {
    return this.dungeon.hasDungeonEndingReward;
  }

  hasMedallion(): boolean {
    return this.dungeon.hasMedallionEntrance;
  }

  getDungeonAbbr(): string {
    return this.dungeon.dungeonAbbr;
  }

  getDungeonName(): string {
    return this.dungeon.dungeonName;
  }

  getBossClasses(): any {
    const results = {
      isBeaten: this.dungeon.isBossDefeated
    };
    results['boss' + this.dungeon.bossId] = true;
    return results;
  }

  getChestClasses(): any {
    const results = {
      chest: true
    };

    const count = !this._settings.isKeysanity()
      ? this.dungeon.itemChestCount
      : this.dungeon.totalChestCount;

    results['chest' + count] = true;
    results['items-remaining'] = count > 0;
    return results;
  }

  getChestResults(): string {
    const count = !this._settings.isKeysanity()
     ? this.dungeon.itemChestCount
     : this.dungeon.totalChestCount;

    return count > 0 ? count + '' : '\xa0';
  }

  getRewardClasses(): any {
    const results = {
      reward: true
    };

    results[this.camelCasePipe.transform(Reward[this.dungeon.reward])] = true;
    return results;
  }

  getMedallionClasses(): any {
    const results = {
      medallion: true
    };

    results[this.dungeon.medallionName] = true;
    return results;
  }

  whenBossClicked(evt: MouseEvent ) {
    evt.stopPropagation();
    evt.preventDefault();

    if ( !this._settings.isBossShuffleOn() ) {
      return;
    }

    if ( !this.dungeon.hasDungeonEndingReward ) {
      return;
    }

    this.dungeon.cycleBossForward();
  }

  whenBossRightClicked( evt: MouseEvent ) {
    evt.stopPropagation();
    evt.preventDefault();

    if ( !this._settings.isBossShuffleOn() ) {
      return;
    }

    if ( !this.dungeon.hasDungeonEndingReward ) {
      return;
    }

    this.dungeon.cycleBossBackward();
  }

  whenChestClicked(evt: MouseEvent): void {
    evt.stopPropagation();
    evt.preventDefault();

    if ( this._settings.isKeysanity() ) {
      this.dungeon.decrementTotalChestCount();
    } else {
      this.dungeon.decrementItemChestCount();
    }
  }

  whenRewardClicked(evt: MouseEvent): void {
    evt.stopPropagation();
    evt.preventDefault();

    this.dungeon.cycleReward();
  }

  whenMedallionClicked(evt: MouseEvent): void {
    evt.stopPropagation();
    evt.preventDefault();

    this.dungeon.cycleEntranceLock();
  }

  whenBigKeyClicked(evt: MouseEvent): void {
    evt.stopPropagation();
    evt.preventDefault();

    this.dungeon.toggleBigKey();
  }

  getBigKeyClasses(): any {
    const results = {};
    results['big-key'] = true;
    results['claimed'] = this.dungeon.hasBigKey;

    return results;
  }

  getSmallKeyClasses(): any {
    const results = {};
    results['small-keys'] = true;
    results['small-keys-' + this.dungeon.smallKeyCount] = true;

    return results;
  }

  whenSmallKeysClicked(evt: MouseEvent): any {
    evt.stopPropagation();
    evt.preventDefault();

    this.dungeon.incrementSmallKeyCount();
  }

  hasSmallKeys(): any {
    if ( !this._settings.isKeysanity() ) {
      return false;
    }

    return this.dungeon.hasSmallKeys;
  }

  whenBossToggleClicked(evt: MouseEvent): void {
    evt.stopPropagation();
    evt.preventDefault();

    this.dungeon.toggleDefeat();
  }

  getBossToggleClasses(): any {
    const results = {
      'fa': true
    };

    if ( this.dungeon.isBossDefeated ) {
      results['fa-check-square-o'] = true;
    } else {
      results['fa-square-o'] = true;
    }

    return results;
  }
} /* istanbul ignore next */
