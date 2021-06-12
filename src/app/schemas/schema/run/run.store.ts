import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";
import { Schema, SchemaDefault } from "../schema";

export interface RunState {
  schema: Schema;
}

@Injectable()
export class RunStore extends ComponentStore<RunState> {

  constructor() {
    super({ schema: new SchemaDefault() });
  }

  readonly movies$: Observable<Schema> = this.select(state => state.schema);
}