import { Component, ComponentFactoryResolver, NgModule } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { ModalInterface, ModalService } from '../../services/modal.service';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'app-sample-modal',
  template: ''
})
class SampleModalComponent implements ModalInterface {
  isShown = false;
  onShow() {
    this.isShown = true;
  }
}

@NgModule({
  declarations: [SampleModalComponent],
  entryComponents: [SampleModalComponent]
})
class ModalTestModule {}

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let modalService: ModalService;
  let componentFactoryResolver: ComponentFactoryResolver;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalComponent],
      imports: [ModalTestModule]
    }).compileComponents();
  }));

  beforeEach(inject(
    [ModalService, ComponentFactoryResolver],
    (_modalService_: ModalService, _componentFactoryResolver_: ComponentFactoryResolver) => {
      modalService = _modalService_;
      componentFactoryResolver = _componentFactoryResolver_;
      spyOn(modalService, 'close');
      spyOn(modalService, 'attach');
    }
  ));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should listen on esc key', () => {
    const escKeyEvent = new KeyboardEvent('keyup', {
      code: 'Escape'
    });

    document.dispatchEvent(escKeyEvent);
    expect(modalService.close).toHaveBeenCalled();
  });

  it('should call modalService.attach', () => {
    expect(modalService.attach).toHaveBeenCalled();
  });

  it('should show modal and call instance onShow after a setTimeout', done => {
    const factory = componentFactoryResolver.resolveComponentFactory(SampleModalComponent);
    const modalRef = component.content.createComponent(factory);
    const instance = modalRef.instance;
    component.show(instance);
    expect(component.isShown).toBe(true);
    setTimeout(() => {
      expect(instance.isShown).toBe(true);
      done();
    });
  });

  it('should hide', () => {
    component.hide();
    expect(component.isShown).toBe(false);
  });
});
