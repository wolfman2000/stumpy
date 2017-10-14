import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Mode } from './options/mode';

@Component({
  selector: 'app-randomizer-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})

export class RandomizerTrackerComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute
  ) {}

  private sub: any;
  tmpMode: Mode;

  ngOnInit(): void {
    this.sub = this.route.params.subscribe( params => {
      const paramMode = params['mode'];
      const casedMode = paramMode[0].toUpperCase() + paramMode.substr(1);
      this.tmpMode = casedMode;
    } );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
} /* istanbul ignore next */
