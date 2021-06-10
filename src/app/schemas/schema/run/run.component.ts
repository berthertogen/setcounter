import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Schema, SchemaDefault } from '../schema';

@Component({
  selector: 'app-schemas-run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.sass']
})
export class SchemasRunComponent implements OnDestroy, OnInit {

  schema: Schema = new SchemaDefault();
  warmupTimer$ = new BehaviorSubject<{ time: DateTime, percent: number }>({ time: DateTime.fromSeconds(0), percent: 100 });
  warmupTimerSubscription: Subscription | null = null;
  running = false;

  constructor(private router: Router) {
    const extras = this.router.getCurrentNavigation();
    if (extras && extras.extras.state) {
      this.schema = JSON.parse(extras.extras.state.schema);
    }
  }
  ngOnInit(): void {
    this.warmupTimer$.next({ time: this.toDateTime(this.schema.warmup * 60), percent: 100 });
  }

  ngOnDestroy(): void {
    if (this.warmupTimerSubscription) {
      this.warmupTimerSubscription.unsubscribe();
    }
  }

  startWarmup() {
    this.running = true;
    const warmupSeconds = this.schema.warmup * 60;
    this.warmupTimerSubscription = interval(1000)
      .pipe(take(warmupSeconds))
      .subscribe(ellapsed => {
        const time = this.toDateTime(warmupSeconds - (ellapsed + 1));
        const percent = 100 - (100 * ellapsed / warmupSeconds) - 1;
        this.warmupTimer$.next({ time, percent });
      });
  }

  private toDateTime(seconds: number): DateTime {
    return DateTime.fromSeconds(seconds);
  }
}
