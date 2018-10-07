import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from '../environments/environment';
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

@NgModule({
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
  entryComponents: [CueEditComponent, ConfirmClearComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
