import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';

import { ModalService } from '../../services/modal.service';

// Invisible from clients, only accessible by ModalService
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements AfterViewInit {
  @ViewChild('content', { read: ViewContainerRef })
  content: ViewContainerRef;
  isShown = false;

  constructor(private modalService: ModalService) {}

  ngAfterViewInit() {
    document.addEventListener(
      'keyup',
      ev => {
        const code = ev.code;
        if (code === 'Escape') {
          this.close();
        } else if (this.isShown) {
          // Stop propagation for everything else
          ev.stopImmediatePropagation();
          ev.stopPropagation();
          return false;
        }
      },
      true
    );
    this.modalService.attach(this, this.content);
  }

  show(instance: any) {
    this.isShown = true;

    // Wait until modal is shown before calling onShow
    setTimeout(() => {
      if (instance.onShow) {
        instance.onShow();
      }
    });
  }

  hide() {
    this.isShown = false;
  }

  close() {
    this.modalService.close();
  }
}
