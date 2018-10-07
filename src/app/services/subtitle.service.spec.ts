import { inject, TestBed } from '@angular/core/testing';

import { SubtitleService } from './subtitle.service';

const text = `WEBVTT

1
00:00:01.930 --> 00:00:03.758
Morty?!

2
00:00:04.899 --> 00:00:06.328
- Morty!
- Rick?

`;

const serializedText = `WEBVTT

00:00:01.930 --> 00:00:03.758
Morty?!

00:00:04.899 --> 00:00:06.328
- Morty!
- Rick?

`;

describe('SubtitleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
  });

  it('should be created', inject([SubtitleService], (service: SubtitleService) => {
    expect(service).toBeTruthy();
  }));

  it('should produce string when parsing and serializing', inject(
    [SubtitleService],
    (service: SubtitleService) => {
      service.parse(text);
      expect(service.getSerialized()).toBe(serializedText);
    }
  ));
});
