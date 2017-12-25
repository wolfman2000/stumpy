import { Component, Input, OnInit } from '@angular/core';
import { DungeonService } from './dungeon.service';
import { Dungeon } from './dungeon';
import { Location } from './location';
import { Reward } from './reward';
import { EntranceLock } from './entrance-lock';
import { CamelCasePipe } from '../camel-case.pipe';

@Component({
  selector: 'stumpy-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.css']
})
export class DungeonComponent implements OnInit {
  constructor(
    private dungeonService: DungeonService,
    private camelCasePipe: CamelCasePipe
  ) { }

  @Input()
  dungeonId: number;

  private dungeon: Dungeon;

  ngOnInit() {
    this.dungeon = this.dungeonService.getDungeon(this.dungeonId);
  }

  hasChests(): boolean {
    return this.dungeon.maxItemChests > 0;
  }

  hasReward(): boolean {
    return this.dungeon.hasDungeonEndingReward;
  }

  hasMedallion(): boolean {
    return this.dungeon.hasMedallionEntrance;
  }

  getBossClasses(): any {
    const results = {
      isBeaten: this.dungeon.isBossDefeated
    };
    results[this.camelCasePipe.transform(this.dungeon.bossName)] = true;
    return results;
  }

  getChestClasses(): any {
    const results = {
      chest: true
    };

    results['chest' + this.dungeon.itemChestCount] = true;
    results['items-remaining'] = this.dungeon.itemChestCount > 0;
    return results;
  }

  getChestResults(): string {
    const remainingCount = this.dungeon.itemChestCount;
    return remainingCount ? remainingCount + '' : '';
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

    results[this.camelCasePipe.transform(EntranceLock[this.dungeon.entranceLock])] = true;
    return results;
  }

  whenClicked(evt: MouseEvent): void {
    this.dungeon.toggleDefeat();
  }

  whenChestClicked(evt: MouseEvent): void {
    evt.stopPropagation();
    evt.preventDefault();

    this.dungeon.decrementChestCount();
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
} /* istanbul ignore next */
