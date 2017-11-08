import { Component } from '@angular/core';
import { GlitchLogic } from './settings/glitch-logic';
import { Mode } from './settings/mode';

import '../assets/css/styles.css';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Stumpy, a Link to the Past Item Tracker';
} /* istanbul ignore next */
