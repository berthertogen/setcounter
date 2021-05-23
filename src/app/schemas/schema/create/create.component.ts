import { Component, EventEmitter, HostBinding, Output } from '@angular/core';
import { Exercise, ExerciseDefault, Schema, SchemaDefault } from 'src/app/schemas/schema/schema';

@Component({
  selector: 'app-schemas-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass']
})
export class SchemasCreateComponent {
  @HostBinding('attr.data-testid')  dataTestid = 'app-schemas-create';
  @Output() save = new EventEmitter<Schema>();

  schema: Schema = new SchemaDefault();

  plusRep() {
    this.schema.exercise.reps++;
  }
  minusRep() {
    this.schema.exercise.reps--;
  }
  plusSet() {
    this.schema.exercise.sets++;
  }
  minusSet() {
    this.schema.exercise.sets--;
  }
  plusIntervalRep() {
    this.schema.intervalReps++;
  }
  minusIntervalRep() {
    this.schema.intervalReps--;
  }

  addExercise() {
    this.schema.exercises.push(this.schema.exercise);
    this.schema.exercise = new ExerciseDefault();
  }

  removeExercise(exercise: Exercise) {
    const index = this.schema.exercises.indexOf(exercise);
    this.schema.exercises.splice(index, 1);
  }
}
