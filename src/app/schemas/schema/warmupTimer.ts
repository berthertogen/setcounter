import { Duration } from 'luxon';

export interface WarmupTimer {
  time: Duration;
  percent: number;
  status: 'stopped' | 'running' | 'paused';
}

export class WarmupTimerDefault implements WarmupTimer {
  time = Duration.fromMillis(0);
  percent = 100;
  status: 'stopped' | 'running' | 'paused' = 'stopped';
}
