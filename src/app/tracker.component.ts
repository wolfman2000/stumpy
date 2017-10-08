import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Mode } from './mode';

@Component({
  selector: 'app-randomizer-tracker',
  templateUrl: './tracker.component.html'
})

export class RandomizerTrackerComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute
  ) {}

  private sub: any;
  tmpMode: Mode;

  private argToMode( param: string ): Mode {
    if ( Mode.Open === param ) {
      return Mode.Open;
    }
    if ( Mode.Swordless === param ) {
      return Mode.Swordless;
    }
    if ( Mode.Standard === param ) {
      return Mode.Standard;
    }
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe( params => {
      const paramMode = params['mode'];
      const casedMode = paramMode[0].toUpperCase() + paramMode.substr(1);
      const test = this.argToMode( casedMode );
      this.tmpMode = test;
    } );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
