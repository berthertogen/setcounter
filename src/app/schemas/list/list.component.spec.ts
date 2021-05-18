import { render } from '@testing-library/angular';
import { ExerciseDefault } from 'src/app/schemas/schema/schema';

import { SchemasListComponent } from './list.component';

describe('ListComponent', () => {
  test('should have text No schemas when no schemas are found', async () => {
    const { hasText } = await createComponent();

    hasText("No schema's found.");
  });

  test('should have schemas when schemas are found', async () => {
    const { hasText, notHasText } = await createComponentWithSchemas();

    notHasText("No schema's found.");

    hasText("Warmup 10 minutes");
    hasText("4 reps of 10 sets");
    hasText("4 reps of 11 sets");
    hasText("3 reps of 12 sets");
    hasText("with 30 seconds between reps and 60 seconds between exercise");
    hasText("14 x interval 20 seconds on and 10 seconds off");

    hasText("Warmup 15 minutes");
    hasText("1 reps of 20 sets");
    hasText("2 reps of 15 sets");
    hasText("3 reps of 10 sets");
    hasText("with 20 seconds between reps and 50 seconds between exercise");
    hasText("15 x interval 25 seconds on and 15 seconds off");
  });

  async function createComponentWithSchemas() {
    const rendered = await render(SchemasListComponent, {
      componentProperties: {
        schemas: [{
          warmup: 10,
          exercises: [
            {reps: 4, sets: 10},
            {reps: 4, sets: 11},
            {reps: 3, sets: 12},
          ],
          exercise: new ExerciseDefault(),
          pauseReps: 60,
          pauseSets: 30,
          intervalReps: 14,
          intervalDuration: 20,
          intervalPause:10
        },
        {
          warmup: 15,
          exercises: [
            {reps: 1, sets: 20},
            {reps: 2, sets: 15},
            {reps: 3, sets: 10},
          ],
          exercise: new ExerciseDefault(),
          pauseReps: 50,
          pauseSets: 20,
          intervalReps: 15,
          intervalDuration: 25,
          intervalPause:15
        }]
      }
    });
    return createComponentWithExtras(rendered);
  }

  async function createComponent() {
    const rendered = await render(SchemasListComponent);
    return createComponentWithExtras(rendered);
  }

  async function createComponentWithExtras(rendered: any) {
    return {
      ...rendered,
      hasText: (text: string) => rendered.getByText(text),
      notHasText: (text: string) => expect( rendered.queryByText(text)).toBeNull(),
    };
  }
});
