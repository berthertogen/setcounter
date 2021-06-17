import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Exercise, ExerciseDefault, Schema, SchemaDefault } from 'src/app/schemas/schema/schema';
import { SchemasService } from '../../schemas.service';

@Component({
  selector: 'app-schemas-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass'],
})
export class SchemasCreateComponent {
  schema: Schema = new SchemaDefault();

  constructor(private router: Router, private schemasService: SchemasService) {}

  plusRep(): void {
    this.schema.exercise.reps++;
  }
  minusRep(): void {
    this.schema.exercise.reps--;
  }
  plusSet(): void {
    this.schema.exercise.sets++;
  }
  minusSet(): void {
    this.schema.exercise.sets--;
  }
  plusIntervalRep(): void {
    this.schema.intervalReps++;
  }
  minusIntervalRep(): void {
    this.schema.intervalReps--;
  }

  addExercise(): void {
    this.schema.exercises.push(this.schema.exercise);
    this.schema.exercise = new ExerciseDefault();
  }

  removeExercise(exercise: Exercise): void {
    const index = this.schema.exercises.indexOf(exercise);
    this.schema.exercises.splice(index, 1);
  }

  save(schema: Schema): void {
    this.schemasService.add(schema);
    void this.router.navigate(['schemas', 'list']);
  }

  cancel(): void {
    void this.router.navigate(['schemas', 'list']);
  }
}
