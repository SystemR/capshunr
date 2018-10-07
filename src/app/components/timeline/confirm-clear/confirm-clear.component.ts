import { Component } from '@angular/core';

import { ModalService } from '../../../services/modal.service';
import { SubtitleService } from '../../../services/subtitle.service';

@Component({
  selector: 'app-confirm-clear',
  templateUrl: './confirm-clear.component.html',
  styleUrls: ['./confirm-clear.component.scss']
})
export class ConfirmClearComponent {
  constructor(private modalService: ModalService, private subtitleService: SubtitleService) {}

  ok() {
    this.subtitleService.clearCues();
    this.modalService.close();
  }

  cancel() {
    this.modalService.close();
  }
}
