import { Component } from '@angular/core';

import { CaptionService } from './caption.service';
import { TextToImage } from './text-to-image.pipe';

@Component({
  selector: 'stumpy-caption',
  templateUrl: './caption.component.html',
  styleUrls: ['./caption.component.css'],
  providers: [TextToImage]
})

export class CaptionComponent {
  constructor(
    private _textToImage: TextToImage,
    private _captionService: CaptionService
  ) {}

  getMessage(): string {
    const message = this._captionService.message;
    if ( !message || message.length === 0 ) {
      return '&nbsp;';
    }

    const transformed = this._textToImage.transform(message);
    return transformed;
  }
}
