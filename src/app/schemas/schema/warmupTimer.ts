import { DateTime } from 'luxon';

export interface WarmupTimer {
  time: DateTime;
  percent: number;
  status: 'stopped' | 'running' | 'paused';
}

export class WarmupTimerDefault implements WarmupTimer {
  time = DateTime.fromSeconds(0);
  percent = 100;
  status: 'stopped' | 'running' | 'paused' = 'stopped';
}
