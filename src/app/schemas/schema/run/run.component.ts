import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTime } from 'luxon';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { SchemasService } from '../../schemas.service';
import { Schema, SchemaDefault } from '../schema';
import { RunStore } from './run.store';

@Component({
  selector: 'app-schemas-run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.sass'],
  providers: [RunStore],
})
export class SchemasRunComponent implements OnDestroy, OnInit {

  schema: Schema = new SchemaDefault();
  warmupTimer$ = new BehaviorSubject<{ time: DateTime, percent: number }>({ time: DateTime.fromSeconds(0), percent: 100 });
  warmupTimerSubscription: Subscription | null = null;
  running = false;

  constructor(private route: ActivatedRoute, private schemaService: SchemasService) {
    const schemaIdParameter = this.route.snapshot.paramMap.get('id');
    if (schemaIdParameter) {
      const schemaId = parseInt(schemaIdParameter);
      this.schema = this.schemaService.getOne(schemaId);
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
