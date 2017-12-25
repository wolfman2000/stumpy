import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Mode } from './settings/mode';

import { Dungeon } from './dungeon/dungeon';
import { EntranceLock } from './dungeon/entrance-lock';
import { Location } from './dungeon/location';
import { Reward } from './dungeon/reward';
import { DungeonService } from './dungeon/dungeon.service';

@Component({
  selector: 'app-randomizer-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})

export class RandomizerTrackerComponent {
  constructor(
    private route: ActivatedRoute,
    private dungeons: DungeonService
  ) {}

  tmpMode: Mode;

  allDungeons(): Dungeon[] {
    return this.dungeons.allDungeons();
  }

  getBossImageClass(dungeon: Dungeon) {
    const results = {
      'boss': true,
      'defeated': dungeon.isBossDefeated
    };
    results['boss' + dungeon.bossId] = true;
    return results;
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

    if ( dungeon.itemChestCount === 0 ) {
      results['chests-claimed'] = true;
    }

    return results;
  }

  getChestCount( dungeon: Dungeon ): string {
    const count = dungeon.itemChestCount;

    return count > 0 ? count + '' : '\xa0';
  }

  getMaxChests( dungeon: Dungeon ) {
    return dungeon.maxItemChests;
  }

  whenChestCountClicked( evt: MouseEvent, dungeon: Dungeon ) {
    evt.stopPropagation();
    evt.preventDefault();

    dungeon.decrementChestCount();
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

  getBigKeyClasses( hasBigKey: boolean ) {
    const results = {
      hiding: true,
      bigKey: true,
      claimed: hasBigKey
    };

    return results;
  }

} /* istanbul ignore next */
