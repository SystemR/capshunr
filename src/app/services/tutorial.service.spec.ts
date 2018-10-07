import { inject, TestBed } from '@angular/core/testing';

import { SubtitleService } from './subtitle.service';
import { TutorialService } from './tutorial.service';

describe('TutorialService', () => {
  let tutorialService: TutorialService;
  let subtitleService: SubtitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  beforeEach(inject([SubtitleService], (_subtitleService_: SubtitleService) => {
    subtitleService = _subtitleService_;
    spyOn(subtitleService, 'getCues').and.returnValue([]);
  }));

  beforeEach(inject([TutorialService], (_tutorialService_: TutorialService) => {
    tutorialService = _tutorialService_;
  }));

  it('should be created and populate cues', () => {
    expect(tutorialService).toBeTruthy();
    expect(tutorialService.hasTutorial).toBe(true);
    expect(tutorialService.cues.length).toBeGreaterThan(0);
  });

  it('should be able to clear tutorial cues', () => {
    tutorialService.clearTutorial();
    expect(tutorialService.cues.length).toBe(0);
  });
});
