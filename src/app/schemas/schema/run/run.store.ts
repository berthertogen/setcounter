import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { SchemasService } from '../../schemas.service';
import { Schema, SchemaDefault } from '../schema';

export interface RunState {
  schema: Schema;
  warmupTimer: {
    time: DateTime;
    percent: number;
  };
  timerRunning: boolean;
}

@Injectable()
export class RunStore extends ComponentStore<RunState> {
  constructor(private schemaService: SchemasService) {
    super({
      schema: new SchemaDefault(),
      warmupTimer: { time: DateTime.fromSeconds(0), percent: 100 },
      timerRunning: false,
    });
  }

  readonly warmupTimer$: Observable<{ time: DateTime; percent: number }> = this.select((state) => state.warmupTimer);
  readonly timerRunning$: Observable<boolean> = this.select((state) => state.timerRunning);

  readonly setSchema = (schema: Schema): void =>
    this.patchState({
      schema,
      warmupTimer: { time: this.toDateTime(schema.warmup * 60), percent: 100 },
      timerRunning: false,
    });

  readonly startWarmup = this.effect((ellapsed$: Observable<number>) => {
    return ellapsed$.pipe(
      take(this.get((state) => state.schema.warmup * 60)),
      tapResponse(
        (ellapsed) =>
          this.patchState((state) => ({
            warmupTimer: this.calculateEllapsed(state.schema.warmup, ellapsed),
            timerRunning: true,
          })),
        (error) => this.logError(error)
      )
    );
  });

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

  private calculateEllapsed = (warmup: number, ellapsed: number) => {
    const warmupSeconds = warmup * 60;
    const time = this.toDateTime(warmupSeconds - (ellapsed + 1));
    const percent = 100 - (100 * ellapsed) / warmupSeconds - 1;
    return { time, percent };
  };
  private logError = (e: unknown) => console.error(e);
  private toDateTime = (seconds: number): DateTime => DateTime.fromSeconds(seconds);
}
