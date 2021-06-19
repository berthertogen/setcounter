import { Duration } from 'luxon';

export interface WarmupTimer {
  time: Duration;
  percent: number;
  status: 'stopped' | 'running' | 'paused';
}

export class WarmupTimerDefault implements WarmupTimer {
  constructor(warmup?: number) {
    this.time = Duration.fromMillis(warmup ? warmup * 60 * 1000 : 0);
  }
  time = Duration.fromMillis(0);
  percent = 100;
  status: 'stopped' | 'running' | 'paused' = 'stopped';
}
