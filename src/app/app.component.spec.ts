import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ModalComponent } from './components/modal/modal.component';
import { ConfirmClearComponent } from './components/timeline/confirm-clear/confirm-clear.component';
import { CueEditComponent } from './components/timeline/cue-edit/cue-edit.component';
import { CueComponent } from './components/timeline/cue/cue.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { VideoComponent } from './components/video/video.component';
import { HeaderComponent } from './layouts/header/header.component';
import { MainComponent } from './layouts/main/main.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        VideoComponent,
        SidebarComponent,
        TimelineComponent,
        HeaderComponent,
        MainComponent,
        CueComponent,
        CueEditComponent,
        ModalComponent,
        ConfirmClearComponent
      ],
      imports: [FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', async(() => {
    expect(app).toBeTruthy();
  }));

  it('should have a header, a main, and a sidebar', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-header')).toBeDefined();
    expect(compiled.querySelector('app-main')).toBeDefined();
    expect(compiled.querySelector('app-sidebar')).toBeDefined();
  }));
});
