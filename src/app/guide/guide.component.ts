import { Component } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'stumpy-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css']
})

export class GuideComponent {
 /* istanbul ignore next */
 constructor(
    private _modalService: NgbModal
  ) {}

 /* istanbul ignore next */
  open( content: any ): void {
    this._modalService.open( content );
  }
}
