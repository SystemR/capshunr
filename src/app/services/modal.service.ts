import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';

import { ModalComponent } from '../components/modal/modal.component';

export interface ModalInterface {
  onShow?;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  component: ModalComponent;
  containerRef: ViewContainerRef;
  modalRef: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  attach(component: ModalComponent, containerRef: ViewContainerRef) {
    this.component = component;
    this.containerRef = containerRef;
  }

  show(componentClass: any, onCreate?: any) {
    if (!this.modalRef) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
      this.modalRef = this.containerRef.createComponent(factory);
      const instance = this.modalRef.instance;
      if (onCreate) {
        onCreate(instance);
      }
      this.modalRef.changeDetectorRef.detectChanges();
      this.component.show(instance);
    }
  }

  close() {
    if (this.modalRef) {
      this.modalRef.destroy();
      this.modalRef = null;
    }
    this.component.hide();
  }
}
