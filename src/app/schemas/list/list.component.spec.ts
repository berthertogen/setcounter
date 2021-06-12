import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { MaterialModule } from 'src/app/material.module';
import { ExerciseDefault, Schema, SchemaDefault } from 'src/app/schemas/schema/schema';
import { Autofixture } from 'ts-autofixture/dist/src';
import { SchemasService } from '../schemas.service';

import { SchemasListComponent } from './list.component';

describe('ListComponent', () => {
  test('should have text No schemas when no schemas are found', async () => {
    const { hasText, hasTitle } = await createComponent();

    hasTitle("+ Create schema");
    hasText("No schema's found.");
  });

  test('should have schemas when schemas are found', async () => {
    const { hasText, notHasText, schemasLoaded, schemas } = await createComponentWithSchemas();

    schemasLoaded(1);
    notHasText("No schema's found.");

    for (const schema of schemas) {
      hasText(`Warmup ${schema.warmup} minutes`);
      for (const exercise of schema.exercises) {
        hasText(`${exercise.reps} reps of ${exercise.sets} sets`);
      }
      hasText(`with ${schema.pauseReps} seconds between reps and ${schema.pauseExercise} seconds between exercise`);
      hasText(`${schema.intervalReps} x interval ${schema.intervalDuration} seconds on and ${schema.intervalPause} seconds off`);
    }
  });

  test('should remove schema from list when Delete schema event is fired', async () => {
    const { clickNthByTitle, schemasRemoved, schemasLoaded, schemas } = await createComponentWithSchemas();

    clickNthByTitle('- Delete schema', 0);

    schemasRemoved(1, schemas[0].id);
    schemasLoaded(2);
  });

  test('should start a run when play button is pressed', async () => {
    const { clickNthByTitle, navigatedToRun, schemas } = await createComponentWithSchemas();

    clickNthByTitle('Run schema', 0);

    navigatedToRun(schemas[0].id);
  });

  async function createComponent() {
    return await createComponentWithExtras([]);
  }

  async function createComponentWithSchemas() {
    return await createComponentWithExtras(mockSchemas());
  }

  async function createComponentWithExtras(schemas: Schema[]) {
    const router = { navigate: jest.fn() };
    const { getAll, remove } = mockSchemaService(schemas);
    const rendered = await render(SchemasListComponent, {
      imports: [MatCardModule, MaterialModule],
      providers: [
        { provide: Router, useValue: router },
        { provide: SchemasService, useValue: { getAll, remove } }
      ]
    });
    return {
      ...rendered,
      schemas,
      hasText: (text: string) => rendered.getByText(text),
      hasTitle: (text: string) => rendered.getByTitle(text),
      notHasText: (text: string) => expect(rendered.queryByText(text)).toBeNull(),
      clickNthByTitle: (text: string, index: number) => userEvent.click(rendered.getAllByTitle(text)[index]),
      schemasLoaded: (times: number) => {
        expect(getAll).toHaveBeenCalledTimes(times);
        expect(rendered.fixture.componentInstance.schemas).toEqual(schemas);
      },
      schemasRemoved: (times: number, index: number) => {
        expect(remove).toHaveBeenNthCalledWith(times, index);
      },
      navigatedToRun: (schemaId: number) => expect(router.navigate).toHaveBeenNthCalledWith(1, ['schemas', 'run', schemaId])
    };
  }

  function mockSchemaService(schemas: Schema[]) {
    const getAll = jest.fn();
    const remove = jest.fn();
    getAll
      .mockReset()
      .mockImplementation(() => schemas);
    remove
      .mockReset();
    return { getAll, remove };
  }

  function mockSchemas() {
    const schemaDefault = {
      ...new SchemaDefault(1),
      exercises: [new ExerciseDefault()]
    };
    return new Autofixture().createMany<Schema>(schemaDefault);
  }
});
