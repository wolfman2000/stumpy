import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Mode } from './settings/mode';
import { Location } from './dungeon/location';

@Component({
  selector: 'app-randomizer-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})

export class RandomizerTrackerComponent {
  constructor(
    private route: ActivatedRoute
  ) {}

  tmpMode: Mode;
} /* istanbul ignore next */
