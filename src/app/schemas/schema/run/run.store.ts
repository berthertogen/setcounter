import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Duration } from 'luxon';
import { Observable } from 'rxjs';
import { filter, map, switchMap, takeWhile } from 'rxjs/operators';
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

  readonly setupWarmupTimer = this.effect((ellapsed$: Observable<number>) => {
    return ellapsed$.pipe(
      takeWhile(() => this.get((state) => state.warmupTimer.status === "running")),
      tapResponse(() =>
        this.patchState((state) => ({
          warmupTimer: this.ellapsed(state.schema.warmup, state.warmupTimer.time),
        })),
        (error) => this.logError(error)
      )
    );
  });

  readonly startWarmup = (): void => this.patchState((state) => ({
    warmupTimer: {
      ...state.warmupTimer,
      status: 'running'
    }
  }));

  readonly pauseWarmup = (): void => this.patchState((state) => ({
    warmupTimer: {
      ...state.warmupTimer,
      status: 'paused'
    }
  }));

  readonly resetWarmup = (): void => this.patchState((state) => ({
    warmupTimer: new WarmupTimerDefault(state.schema.warmup)
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

  private readonly setSchema = (schema: Schema): void =>
    this.patchState({
      schema,
      warmupTimer: { time: this.toDateTime(schema.warmup * 60), percent: 100, status: 'stopped' },
    });

  private ellapsed = (warmup: number, time: Duration): WarmupTimer => {
    time = time.minus({ seconds: 1 });
    const totalSeconds = warmup * 60;
    const ellapsedSeconds = (time.toMillis() / 1000);
    const percent = ellapsedSeconds / totalSeconds * 100;
    return { time, percent, status: 'running' };
  };
  private logError = (e: unknown) => console.error(e);
  private toDateTime = (seconds: number): Duration => Duration.fromMillis(seconds * 1000);
}
