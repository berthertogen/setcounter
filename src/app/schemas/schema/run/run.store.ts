import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { SchemasService } from '../../schemas.service';
import { Schema, SchemaDefault } from '../schema';
import { WarmupTimer, WarmupTimerDefault } from '../warmupTimer';

export interface RunState {
  schema: Schema;
  warmupTimer: WarmupTimer;
}

@Injectable()
export class RunStore extends ComponentStore<RunState> {
  constructor(private schemaService: SchemasService) {
    super({
      schema: new SchemaDefault(),
      warmupTimer: new WarmupTimerDefault(),
    });
  }

  readonly warmupTimer$: Observable<WarmupTimer> = this.select((state) => state.warmupTimer);
  readonly timerPaused$: Observable<boolean> = this.select((state) => state.warmupTimer.status).pipe(
    filter(status => status === 'paused'),
    map(_ => true)
  );

  readonly setSchema = (schema: Schema): void =>
    this.patchState({
      schema,
      warmupTimer: { time: this.toDateTime(schema.warmup * 60), percent: 100, status: 'stopped' },
    });

  readonly startWarmup = this.effect((ellapsed$: Observable<number>) => {
    return ellapsed$.pipe(
      takeUntil(this.timerPaused$),
      tapResponse(
        (ellapsed) =>
          this.patchState((state) => ({
            warmupTimer: this.calculateEllapsed(state.schema.warmup, ellapsed),
          })),
        (error) => this.logError(error)
      )
    );
  });

  readonly pauseWarmup = (): void => this.patchState((state) => ({
    warmupTimer: {
      ...state.warmupTimer,
      status: 'paused'
    }
  }));

  readonly getSchema = this.effect((schemaId$: Observable<string | null>) => {
    return schemaId$.pipe(
      filter((schemaId) => !!schemaId),
      map((schemaId) => parseInt(schemaId as string)),
      switchMap((schemaId) =>
        this.schemaService.getOne(schemaId).pipe(
          tapResponse(
            (schema) => this.setSchema(schema),
            (error) => this.logError(error)
          )
        )
      )
    );
  });

  private calculateEllapsed = (warmup: number, ellapsed: number): WarmupTimer => {
    const warmupSeconds = warmup * 60;
    const time = this.toDateTime(warmupSeconds - (ellapsed + 1));
    const percent = 100 - (100 * ellapsed) / warmupSeconds - 1;
    return { time, percent, status: 'running' };
  };
  private logError = (e: unknown) => console.error(e);
  private toDateTime = (seconds: number): DateTime => DateTime.fromSeconds(seconds);
}
