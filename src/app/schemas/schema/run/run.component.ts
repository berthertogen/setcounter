import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription, timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WarmupTimer } from '../warmupTimer';
import { RunStore } from './run.store';

@Component({
  selector: 'app-schemas-run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.sass'],
  providers: [RunStore],
})
export class SchemasRunComponent {
  warmupTimer$: Observable<WarmupTimer> = this.runStore.warmupTimer$;
  timerSub: Subscription = new Subscription();

  constructor(private route: ActivatedRoute, private readonly runStore: RunStore) {
    this.runStore.getSchema(this.route.snapshot.paramMap.get('id'));
  }

  startWarmup(): void {
    this.timerSub = this.runStore.setupWarmupTimer(timer(0, 1000));
    this.runStore.startWarmup();
  }

  pauseWarmup(): void {
    this.timerSub.unsubscribe();
    this.runStore.pauseWarmup();
  }

  resetWarmup(): void {
    this.timerSub.unsubscribe();
    this.runStore.resetWarmup();
  }
}
