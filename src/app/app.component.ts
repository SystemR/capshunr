import { ModalService } from './services/modal.service';
import { AfterViewInit, Component } from '@angular/core';
import { TimingService } from './services/timing.service';
import { TutorialService } from './services/tutorial.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private tutorialService: TutorialService) {}
}
