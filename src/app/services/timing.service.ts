import { Injectable } from '@angular/core';

export interface TimeSubscriber {
  onTime(time: number);
  onDuration?(time: number);
}

@Injectable({
  providedIn: 'root'
})
export class TimingService {
  time = 0;
  duration: number;

  private eventSubscribers: TimeSubscriber[] = [];

  constructor() {}

  subscribe(eventSubscriber: TimeSubscriber) {
    this.eventSubscribers.push(eventSubscriber);
  }

  unsubscribe(eventSubscriber) {
    this.eventSubscribers.splice(this.eventSubscribers.indexOf(eventSubscriber), 1);
  }

  setTime(time: number, sender: TimeSubscriber) {
    if (time < 0) {
      time = 0;
    }
    this.time = time;

    for (const subscriber of this.eventSubscribers) {
      if (subscriber !== sender) {
        subscriber.onTime(time);
      }
    }
  }

  setDuration(duration: number, sender?: TimeSubscriber) {
    this.duration = duration;

    for (const subscriber of this.eventSubscribers) {
      if ((!sender || (sender && subscriber !== sender)) && subscriber.onDuration) {
        subscriber.onDuration(this.duration);
      }
    }
  }
}
