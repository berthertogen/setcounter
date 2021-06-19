import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, timer } from 'rxjs';
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

  constructor(private route: ActivatedRoute, private readonly runStore: RunStore) {
    this.runStore.getSchema(this.route.snapshot.paramMap.get('id'));
  }

  startWarmup(): void {
    this.runStore.startWarmup(timer(0, 1000));
  }

  pauseWarmup(): void {
    this.runStore.pauseWarmup();
  }
}
