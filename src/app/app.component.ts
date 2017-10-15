import { Component } from '@angular/core';
import { GlitchLogic } from './options/glitch-logic';
import { Mode } from './options/mode';
import { Settings } from './settings';
import { InventoryService } from './inventory.service';

import '../assets/css/styles.css';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Stumpy, a Link to the Past Item Tracker';
} /* istanbul ignore next */
