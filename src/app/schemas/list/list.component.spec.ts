import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { MaterialModule } from 'src/app/material.module';
import { ExerciseDefault, Schema, SchemaDefault } from 'src/app/schemas/schema/schema';
import { Autofixture } from 'ts-autofixture/dist/src';

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
    const { clickNthByTitle, schemasSaved, schemas } = await createComponentWithSchemas();

    clickNthByTitle('- Delete schema', 0);

    schemas.splice(0, 1);
    schemasSaved(1, [schemas]);
  });

  test('should start a run when play button is pressed', async () => {
    const { clickNthByTitle, navigatedToRun, schemas } = await createComponentWithSchemas();

    clickNthByTitle('Run schema', 0);

    navigatedToRun(schemas[0]);
  });

  async function createComponent() {
    return await createComponentWithExtras([]);
  }

  async function createComponentWithSchemas() {
    return await createComponentWithExtras(mockSchemas());
  }

  async function createComponentWithExtras(schemas: Schema[]) {
    const router = { navigate: jest.fn() };
    const { getItem, setItem } = mockLocalStorage(schemas);
    const rendered = await render(SchemasListComponent, {
      imports: [MatCardModule, MaterialModule],
      providers: [
        { provide: Router, useValue: router }
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
        expect(getItem).toHaveBeenNthCalledWith(times, 'setcounter-schemas');
        expect(rendered.fixture.componentInstance.schemas).toEqual(schemas);
      },
      schemasSaved: (times: number, schemas: Schema[][]) => {
        expect(setItem).toHaveBeenCalledTimes(times);
        for (const schema of schemas) {
          expect(setItem).toHaveBeenCalledWith('setcounter-schemas', JSON.stringify(schema));
        }
      },
      navigatedToRun: (schema: Schema) => expect(router.navigate).toHaveBeenNthCalledWith(1, ['schemas', 'run'], { state: { schema: JSON.stringify(schema) } })
    };
  }

  function mockLocalStorage(schemas: Schema[]) {
    const getItem = jest.fn();
    const setItem = jest.fn();
    getItem
      .mockReset()
      .mockImplementation(() => JSON.stringify(schemas));
    setItem
      .mockReset();
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem,
        setItem,
      },
      writable: true
    });
    return { getItem, setItem };
  }

  function mockSchemas() {
    const schemaDefault = {
      ...new SchemaDefault(),
      exercises: [new ExerciseDefault()]
    };
    return new Autofixture().createMany<Schema>(schemaDefault);
  }
});
