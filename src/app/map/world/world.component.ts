import { Component, Input, OnInit } from '@angular/core';
import { Worlds } from './world.repository';
import { World } from './world';

@Component({
  selector: 'stumpy-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css']
})

export class WorldComponent implements OnInit {
  @Input()
  worldId: number;

  private world: World;

  ngOnInit() {
    this.world = Worlds.get(this.worldId);
  }

  getMapClasses(): any {
    const results = {};
    results[this.world.name] = true;
    return results;
  }
}
