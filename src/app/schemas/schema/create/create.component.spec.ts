import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { render } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { MaterialModule } from 'src/app/material.module';
import { ExerciseDefault, Schema, SchemaDefault } from 'src/app/schemas/schema/schema';
import { Autofixture } from 'ts-autofixture/dist/src';
import { SchemasService } from '../../schemas.service';
import { SchemasCreateComponent } from './create.component';

describe('CreateComponent - overall', () => {
  test('should show warmup range, reps, sets, add exercise when clicking the create schema button', async () => {
    const { getByText, getByLabelText } = await createComponent();

    expect(getByLabelText('Warmup duration (sec)')).toBeDefined();
    expect(getByLabelText('Reps')).toBeDefined();
    expect(getByLabelText('Sets')).toBeDefined();
    expect(getByText('No exercises added yet.')).toBeDefined();
    expect(getByText('+ Add exercise')).toBeDefined();
    expect(getByLabelText('Pause between exercise (sec)')).toBeDefined();
    expect(getByLabelText('Pause between reps (sec)')).toBeDefined();
    expect(getByLabelText('Interval reps')).toBeDefined();
    expect(getByLabelText('Interval duration (sec)')).toBeDefined();
    expect(getByLabelText('Interval pause (sec)')).toBeDefined();
  });

  test('should show default values', async () => {
    const { fixture } = await createComponent();

    expect(fixture.componentInstance.schema.warmup).toBe(10);
    expect(fixture.componentInstance.schema.exercise.reps).toBe(3);
    expect(fixture.componentInstance.schema.exercise.sets).toBe(12);
    expect(fixture.componentInstance.schema.pauseExercise).toBe(60);
    expect(fixture.componentInstance.schema.pauseReps).toBe(30);
    expect(fixture.componentInstance.schema.intervalReps).toBe(14);
    expect(fixture.componentInstance.schema.intervalDuration).toBe(20);
    expect(fixture.componentInstance.schema.intervalPause).toBe(10);
  });

  test('should call schemasService add when save schema is clicked', async () => {
    const { click, clickByTitle, changeSlider, schemasSaved, navigatedToList } = await createComponent();

    changeSlider('Warmup duration (sec)', 2);

    clickByTitle('Plus rep', 1);
    clickByTitle('Plus set', 1);
    click('+ Add exercise');

    clickByTitle('Plus rep', 2);
    clickByTitle('Plus set', 2);
    click('+ Add exercise');
    changeSlider('Pause between exercise (sec)', 6);
    changeSlider('Pause between reps (sec)', 6);

    clickByTitle('Plus interval reps', 1);
    changeSlider('Interval duration (sec)', 4);
    changeSlider('Interval pause (sec)', 2);

    click('Save schema');

    schemasSaved(1, {
      id: 0,
      warmup: 10,
      exercise: new ExerciseDefault(),
      exercises: [
        { reps: 4, sets: 13 },
        { reps: 5, sets: 14 },
      ],
      pauseExercise: 60,
      pauseReps: 30,
      intervalReps: 15,
      intervalDuration: 20,
      intervalPause: 10
    });
    navigatedToList();
  });

  test('should call schemasService add when save schema is clicked', async () => {
    const { click, clickByTitle, changeSlider, schemasSaved, schemas, navigatedToList } = await createComponentWithSchemas();

    changeSlider('Warmup duration (sec)', 2);

    clickByTitle('Plus rep', 1);
    clickByTitle('Plus set', 1);
    click('+ Add exercise');

    clickByTitle('Plus rep', 2);
    clickByTitle('Plus set', 2);
    click('+ Add exercise');
    changeSlider('Pause between exercise (sec)', 6);
    changeSlider('Pause between reps (sec)', 6);

    clickByTitle('Plus interval reps', 1);
    changeSlider('Interval duration (sec)', 4);
    changeSlider('Interval pause (sec)', 2);

    click('Save schema');

    const schema = {
      id: 0,
      warmup: 10,
      exercise: new ExerciseDefault(),
      exercises: [
        { reps: 4, sets: 13 },
        { reps: 5, sets: 14 },
      ],
      pauseExercise: 60,
      pauseReps: 30,
      intervalReps: 15,
      intervalDuration: 20,
      intervalPause: 10
    };
    schemasSaved(1, schema);
    navigatedToList();
  });

  test('should navigate to list when cancel is clicked', async () => {
    const { click, navigatedToList } = await createComponent();

    click("Cancel");

    navigatedToList();
  });

  async function createComponent() {
    return await createComponentWithExtras([]);
  }

  async function createComponentWithSchemas() {
    return await createComponentWithExtras(mockSchemas());
  }

  async function createComponentWithExtras(schemas: Schema[]) {
    const { add } = mockSchemaService();
    const router = { navigate: jest.fn() };
    const rendered = await render(SchemasCreateComponent, {
      imports: [FormsModule, MaterialModule],
      providers: [
        { provide: Router, useValue: router },
        { provide: SchemasService, useValue: { add } }
      ]
    });
    return {
      ...rendered,
      schemas,
      click: (text: string) => userEvent.click(rendered.getByText(text)),
      clickByTitle: (title: string, times?: number) => {
        for (let index = 0; index < (times || 1); index++) {
          userEvent.click(rendered.getByTitle(title));
        }
      },
      clickAllByTitle: (title: string, indexToClick: number) => {
        userEvent.click(rendered.getAllByTitle(title)[indexToClick]);
      },
      changeSlider: (label: string, addSteps: number) => {
        const input = rendered.getByLabelText(label);
        const keys = [...Array(addSteps).keys()].map(() => '{arrowright}');
        userEvent.type(input, keys.join());
      },
      type: (label: string, value: string) => {
        const input = rendered.getByLabelText(label);
        userEvent.clear(input);
        userEvent.type(input, value);
      },
      schemasSaved: (times: number, schemas: Schema) => {
        expect(add).toHaveBeenNthCalledWith(times, schemas);
      },
      navigatedToList: () => expect(router.navigate).toHaveBeenNthCalledWith(1, ['schemas', 'list'])
    };
  }

  function mockSchemaService() {
    const add = jest.fn();
    add.mockReset();
    return { add };
  }

  function mockSchemas() {
    const schemaDefault = {
      ...new SchemaDefault(),
      exercises: [new ExerciseDefault()]
    };
    return new Autofixture().createMany<Schema>(schemaDefault);
  }
});
