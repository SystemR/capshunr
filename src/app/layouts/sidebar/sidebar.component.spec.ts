import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CueComponent } from './../../components/timeline/cue/cue.component';
import { TimelineComponent } from './../../components/timeline/timeline.component';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent, TimelineComponent, CueComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a timeline', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-timeline')).toBeDefined();
  }));
});
