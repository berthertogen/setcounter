import { MatCardModule } from '@angular/material/card';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { MaterialModule } from 'src/app/material.module';
import { ExerciseDefault, Schema } from 'src/app/schemas/schema/schema';

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

  test('should emit Delete schema event when Delete schema button is clicked', async () => {
    const { clickNthByTitle, deleteCalledWith } = await createComponentWithSchemas();
    
    clickNthByTitle('- Delete schema', 1);
    deleteCalledWith(1, {
      warmup: 15,
      exercises: [
        { reps: 1, sets: 20 },
        { reps: 2, sets: 15 },
        { reps: 3, sets: 10 },
      ],
      exercise: new ExerciseDefault(),
      pauseReps: 50,
      pauseSets: 20,
      intervalReps: 15,
      intervalDuration: 25,
      intervalPause: 15
    });
  });

  async function createComponentWithSchemas() {
    const deleteEmitSpy = jest.fn();
    const rendered = await render(SchemasListComponent, {
      imports: [MatCardModule, MaterialModule],
      componentProperties: {
        schemas: [{
          warmup: 10,
          exercises: [
            { reps: 4, sets: 10 },
            { reps: 4, sets: 11 },
            { reps: 3, sets: 12 },
          ],
          exercise: new ExerciseDefault(),
          pauseReps: 60,
          pauseSets: 30,
          intervalReps: 14,
          intervalDuration: 20,
          intervalPause: 10
        },
        {
          warmup: 15,
          exercises: [
            { reps: 1, sets: 20 },
            { reps: 2, sets: 15 },
            { reps: 3, sets: 10 },
          ],
          exercise: new ExerciseDefault(),
          pauseReps: 50,
          pauseSets: 20,
          intervalReps: 15,
          intervalDuration: 25,
          intervalPause: 15
        }],
        delete: {
          emit: deleteEmitSpy,
        } as any
      },
    });
    return createComponentWithExtras(rendered, deleteEmitSpy);
  }

  async function createComponent() {
    const deleteEmitSpy = jest.fn();
    const rendered = await render(SchemasListComponent, {
      imports: [MatCardModule, MaterialModule],
      componentProperties: {
        delete: {
          emit: deleteEmitSpy,
        } as any
      }
    });
    return createComponentWithExtras(rendered, deleteEmitSpy);
  }

  async function createComponentWithExtras(rendered: any, deleteEmitSpy: jest.Mock) {
    return {
      ...rendered,
      hasText: (text: string) => rendered.getByText(text),
      notHasText: (text: string) => expect(rendered.queryByText(text)).toBeNull(),
      clickNthByTitle: (text: string, index: number) => userEvent.click(rendered.getAllByTitle(text)[index]),
      deleteCalledWith: (times: number, schema: Schema) => expect(deleteEmitSpy).toHaveBeenNthCalledWith(times, schema),
    };
  }
});
