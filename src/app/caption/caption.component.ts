import { Component } from '@angular/core';

import { CaptionService } from './caption.service';

@Component({
  selector: 'stumpy-caption',
  templateUrl: './caption.component.html',
  styleUrls: ['./caption.component.css']
})

export class CaptionComponent {
  constructor(
    private _captionService: CaptionService
  ) {}

  getMessage(): string {
    const message = this._captionService.message;
    if ( !message || message.length === 0 ) {
      return '&nbsp;';
    }

    return message;
  }
}
