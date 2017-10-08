import { Component } from '@angular/core';
import { GlitchLogic } from './glitch-logic';
import { Mode } from './mode';
import { Settings } from './settings';
import { InventoryService } from './inventory.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Stumpy, a Link to the Past Item Tracker';
}
