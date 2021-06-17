import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateTime } from 'luxon';
import { Observable, Subscription, timer } from 'rxjs';
import { RunStore } from './run.store';

@Component({
  selector: 'app-schemas-run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.sass'],
  providers: [RunStore],
})
export class SchemasRunComponent implements OnDestroy {
  warmupTimer$: Observable<{ time: DateTime; percent: number }> = this.runStore.warmupTimer$;
  warmupTimerSubscription: Subscription | null = null;
  running$: Observable<boolean> = this.runStore.timerRunning$;

  constructor(private route: ActivatedRoute, private readonly runStore: RunStore) {
    this.runStore.getSchema(this.route.snapshot.paramMap.get('id'));
  }

  ngOnDestroy(): void {
    if (this.warmupTimerSubscription) {
      this.warmupTimerSubscription.unsubscribe();
    }
  }

  startWarmup(): void {
    this.runStore.startWarmup(timer(0, 1000));
  }
}
