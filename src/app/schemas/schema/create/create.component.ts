import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Exercise, ExerciseDefault, Schema, SchemaDefault } from 'src/app/schemas/schema/schema';
import { SchemasService } from '../../schemas.service';

@Component({
  selector: 'app-schemas-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass']
})
export class SchemasCreateComponent {
  schema: Schema = new SchemaDefault();

  constructor(private router: Router, private schemasService: SchemasService) { }

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

  save(schema: Schema) {
    this.schemasService.add(schema);
    this.router.navigate(['schemas', 'list']);
  }

  cancel() {
    this.router.navigate(['schemas', 'list']);
  }
}
