import { Component } from '@angular/core';
import { ItemShuffle } from './settings/item-shuffle';

import { Dungeon } from './dungeon/dungeon';
import { EntranceLock } from './dungeon/entrance-lock';
import { Location } from './dungeon/location';
import { Reward } from './dungeon/reward';
import { DungeonService } from './dungeon/dungeon.service';
import { SettingsService } from './settings/settings.service';

@Component({
  selector: 'app-randomizer-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})

export class RandomizerTrackerComponent {
  constructor(
    private dungeons: DungeonService,
    private _settings: SettingsService
  ) {}

  allDungeons(): Dungeon[] {
    return this.dungeons.allDungeons();
  }

  getKeysanityClass(): any {
    return {
      hiding: this._settings.itemShuffle !== ItemShuffle.Keysanity
    };
  }

  getBossImageClass(dungeon: Dungeon) {
    const isBossShuffleOn = this._settings.isBossShuffleOn();
    const results = {
      'boss': true,
      'defeated': dungeon.isBossDefeated,
      'pointer': isBossShuffleOn && dungeon.hasDungeonEndingReward
    };

    results['boss' + dungeon.bossId] = true;
    return results;
  }

  whenBossClicked(evt: MouseEvent, dungeon: Dungeon ) {
    evt.stopPropagation();
    evt.preventDefault();

    if ( !this._settings.isBossShuffleOn() ) {
      return;
    }

    if ( !dungeon.hasDungeonEndingReward ) {
      return;
    }

    dungeon.cycleBossForward();
  }

  whenBossRightClicked( evt: MouseEvent, dungeon: Dungeon ) {
    evt.stopPropagation();
    evt.preventDefault();

    if ( !this._settings.isBossShuffleOn() ) {
      return;
    }

    if ( !dungeon.hasDungeonEndingReward ) {
      return;
    }

    dungeon.cycleBossBackward();
  }

  whenDefeatedClicked( evt: MouseEvent, dungeon: Dungeon ) {
    dungeon.toggleDefeat();
  }

  getRewardClasses( reward: Reward ) {
    const results = {
      'reward': true
    };

    results['reward' + reward] = true;
    return results;
  }

  whenRewardClicked( evt: MouseEvent, dungeon: Dungeon ) {
    evt.stopPropagation();
    evt.preventDefault();

    dungeon.cycleReward();
  }

  getChestCountClasses( dungeon: Dungeon ) {
    const results = {
      chests: true,
      counter: true
    };

    const count = this._settings.itemShuffle !== ItemShuffle.Keysanity
      ? dungeon.itemChestCount
      : dungeon.totalChestCount;

    if ( count === 0 ) {
      results['chests-claimed'] = true;
    }

    return results;
  }

  getChestCount( dungeon: Dungeon ): string {
    const count = this._settings.itemShuffle !== ItemShuffle.Keysanity
     ? dungeon.itemChestCount
     : dungeon.totalChestCount;

    return count > 0 ? count + '' : '\xa0';
  }

  getMaxChestCountClasses( dungeon: Dungeon ): any {
    const results = {
      'chests': true
    };

    const count = this._settings.itemShuffle !== ItemShuffle.Keysanity
      ? dungeon.maxItemChests
      : dungeon.maxTotalChests;

    results['chests-claimed'] = count === 0;

    return results;
  }

  getMaxChests( dungeon: Dungeon ): string {
    const count = this._settings.itemShuffle !== ItemShuffle.Keysanity
      ? dungeon.maxItemChests
      : dungeon.maxTotalChests;

      return count > 0 ? count + '' : '\xa0';
  }

  whenChestCountClicked( evt: MouseEvent, dungeon: Dungeon ) {
    evt.stopPropagation();
    evt.preventDefault();

    if ( this._settings.itemShuffle === ItemShuffle.Keysanity ) {
      dungeon.decrementTotalChestCount();
    } else {
      dungeon.decrementItemChestCount();
    }
  }

  getMedallionClasses( entranceLock: EntranceLock ) {
    const results = {
      'medallion': true,
      'entrance': entranceLock !== EntranceLock.None
    };

    results['medallion' + entranceLock] = true;
    return results;
  }

  whenMedallionClicked( evt: MouseEvent, dungeon: Dungeon ) {
    evt.stopPropagation();
    evt.preventDefault();

    dungeon.cycleEntranceLock();
  }

  getSmallKeyCountClasses( dungeon: Dungeon ) {
    const results = {
      chests: true,
      counter: true
    };

    if ( dungeon.smallKeyCount === 0 ) {
      results['chests-claimed'] = true;
    }

    return results;
  }

  getSmallKeyCount( dungeon: Dungeon ) {
    const count = dungeon.smallKeyCount;

    return count > 0 ? count + '' : '\xa0';
  }

  getMaxSmallKeyCountClasses( dungeon: Dungeon ) {
    const results = {
      chests: true
    };

    if ( dungeon.maxSmallKeys === 0 ) {
      results['chests-claimed'] = true;
    }

    return results;
  }

  getMaxSmallKeyCount( dungeon: Dungeon ) {
    const count = dungeon.maxSmallKeys;

    return count > 0 ? count + '' : '\xa0';
  }

  whenKeyCountClicked( evt: MouseEvent, dungeon: Dungeon ) {
    evt.stopPropagation();
    evt.preventDefault();

    dungeon.incrementSmallKeyCount();
  }

  getBigKeyClasses( dungeon: Dungeon ) {
    const results = {
      hiding: dungeon.bossId === Location.CastleTower,
      bigKey: true,
      claimed: dungeon.hasBigKey
    };

    return results;
  }

  whenBigKeyClicked( evt: MouseEvent, dungeon: Dungeon ) {
    evt.stopPropagation();
    evt.preventDefault();

    dungeon.toggleBigKey();
  }

} /* istanbul ignore next */
