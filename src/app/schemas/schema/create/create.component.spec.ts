import { FormsModule } from '@angular/forms';
import { fireEvent, render } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { MaterialModule } from 'src/app/material.module';
import { ExerciseDefault, Schema } from 'src/app/schemas/schema/schema';
import { SchemasCreateComponent } from './create.component';

describe('CreateComponent', () => {
  test('should show warmup range, reps, sets, add exercise when clicking the create schema button', async () => {
    const { getByText, getByLabelText } = await createComponent();

    expect(getByLabelText('Warmup duration (sec)')).toBeDefined();
    expect(getByLabelText('Reps')).toBeDefined();
    expect(getByLabelText('Sets')).toBeDefined();
    expect(getByText('No exercises added yet.')).toBeDefined();
    expect(getByText('+ Add exercise')).toBeDefined();
    expect(getByLabelText('Pause between reps (sec)')).toBeDefined();
    expect(getByLabelText('Pause between sets (sec)')).toBeDefined();
    expect(getByLabelText('Interval reps')).toBeDefined();
    expect(getByLabelText('Interval duration (sec)')).toBeDefined();
    expect(getByLabelText('Interval pause (sec)')).toBeDefined();
  });

  test('should show default values', async () => {
    const { fixture } = await createComponent();

    expect(fixture.componentInstance.schema.warmup).toBe(10);
    expect(fixture.componentInstance.schema.exercise.reps).toBe(3);
    expect(fixture.componentInstance.schema.exercise.sets).toBe(12);
    expect(fixture.componentInstance.schema.pauseReps).toBe(60);
    expect(fixture.componentInstance.schema.pauseSets).toBe(30);
    expect(fixture.componentInstance.schema.intervalReps).toBe(14);
    expect(fixture.componentInstance.schema.intervalDuration).toBe(20);
    expect(fixture.componentInstance.schema.intervalPause).toBe(10);
  });

  test('should update warmup value when sliding the range', async () => {
    const { getByText, changeSlider, fixture } = await createComponent();

    changeSlider('Warmup duration (sec)', 2);

    expect(fixture.componentInstance.schema.warmup).toBe(10);
    expect(getByText('10 minutes')).toBeDefined();
  });

  test('should update reps value when typing the reps', async () => {
    const { type, fixture } = await createComponent();

    type('Reps', "4");

    expect(fixture.componentInstance.schema.exercise.reps).toBe(4);
  });

  test('should update reps value when clicking plus or minus the reps', async () => {
    const { clickByTitle, fixture } = await createComponent();

    clickByTitle('Plus rep', 2);

    expect(fixture.componentInstance.schema.exercise.reps).toBe(5);

    clickByTitle('Minus rep', 3);

    expect(fixture.componentInstance.schema.exercise.reps).toBe(2);
  });

  test('should update sets value when typing the sets', async () => {
    const { type, fixture } = await createComponent();

    type('Sets', "4");

    expect(fixture.componentInstance.schema.exercise.sets).toBe(4);
  });

  test('should update sets value when clicking plus or minus the sets', async () => {
    const { clickByTitle, fixture } = await createComponent();

    clickByTitle('Plus set', 4);

    expect(fixture.componentInstance.schema.exercise.sets).toBe(16);

    clickByTitle('Minus set', 2);

    expect(fixture.componentInstance.schema.exercise.sets).toBe(14);
  });

  test('should add exercise to list and clear form when clicking Add exercise', async () => {
    const { getByText, queryByText, fixture, click, clickByTitle } = await createComponent();

    clickByTitle('Plus rep', 1);
    clickByTitle('Plus set', 1);
    click('+ Add exercise');

    expect(queryByText('No exercises added yet.')).toBeNull();
    getByText("Reps 4 & Sets 13");

    expect(fixture.componentInstance.schema.exercise.reps).toBe(3);
    expect(fixture.componentInstance.schema.exercise.sets).toBe(12);
  });

  test('should remove excercise when user clicks on the - in the list', async () => {
    const { queryAllByText, click, clickByTitle, clickAllByTitle } = await createComponent();

    clickByTitle('Plus rep', 1);
    clickByTitle('Plus set', 1);
    click('+ Add exercise');

    clickByTitle('Plus rep', 1);
    clickByTitle('Plus set', 1);
    click('+ Add exercise');

    clickByTitle('Plus rep', 2);
    clickByTitle('Plus set', 2);
    click('+ Add exercise');

    expect(queryAllByText("Reps 4 & Sets 13").length).toBe(2);
    expect(queryAllByText("Reps 5 & Sets 14").length).toBe(1);

    clickAllByTitle('Remove excercise', 1);

    expect(queryAllByText("Reps 4 & Sets 13").length).toBe(1);
    expect(queryAllByText("Reps 5 & Sets 14").length).toBe(1);
  });

  test('should update pauseReps value when sliding the range', async () => {
    const { getByText, changeSlider, fixture } = await createComponent();

    changeSlider('Pause between reps (sec)', 6);

    expect(fixture.componentInstance.schema.pauseReps).toBe(60);
    expect(getByText('60 seconds')).toBeDefined();
  });

  test('should update pauseSets value when sliding the range', async () => {
    const { getByText, changeSlider, fixture } = await createComponent();

    changeSlider('Pause between sets (sec)', 6);

    expect(fixture.componentInstance.schema.pauseSets).toBe(30);
    expect(getByText('30 seconds')).toBeDefined();
  });

  test('should update intervalReps value when typing the intervalReps', async () => {
    const { type, fixture } = await createComponent();

    type('Interval reps', '14');

    expect(fixture.componentInstance.schema.intervalReps).toBe(14);
  });

  test('should update intervalReps value when clicking plus or minus the intervalReps', async () => {
    const { clickByTitle, fixture } = await createComponent();

    clickByTitle('Plus interval reps', 1);

    expect(fixture.componentInstance.schema.intervalReps).toBe(15);

    clickByTitle('Minus interval reps', 2);

    expect(fixture.componentInstance.schema.intervalReps).toBe(13);
  });

  test('should update intervalDuration value when sliding the range', async () => {
    const { getByText, changeSlider, fixture } = await createComponent();

    changeSlider('Interval duration (sec)', 4);

    expect(fixture.componentInstance.schema.intervalDuration).toBe(20);
    expect(getByText('20 seconds')).toBeDefined();
  });

  test('should update intervalPause value when sliding the range', async () => {
    const { getByText, changeSlider, fixture } = await createComponent();

    changeSlider('Interval pause (sec)', 2);

    expect(fixture.componentInstance.schema.intervalPause).toBe(10);
    expect(getByText('10 seconds')).toBeDefined();
  });

  test('should emit output when save schema is clicked', async () => {
    const { click, clickByTitle, changeSlider, saveNthCalledWith } = await createComponent();

    changeSlider('Warmup duration (sec)', 2);

    clickByTitle('Plus rep', 1);
    clickByTitle('Plus set', 1);
    click('+ Add exercise');

    clickByTitle('Plus rep', 2);
    clickByTitle('Plus set', 2);
    click('+ Add exercise');
    changeSlider('Pause between reps (sec)', 6);
    changeSlider('Pause between sets (sec)', 6);

    clickByTitle('Plus interval reps', 1);
    changeSlider('Interval duration (sec)', 4);
    changeSlider('Interval pause (sec)', 2);

    click('Save schema');

    saveNthCalledWith(1, {
      warmup: 10,
      exercises: [
        { reps: 4, sets: 13 },
        { reps: 5, sets: 14 },
      ],
      exercise: new ExerciseDefault(),
      pauseReps: 60,
      pauseSets: 30,
      intervalReps: 15,
      intervalDuration: 20,
      intervalPause: 10
    })
  });

  async function createComponent() {
    const saveEmitSpy = jest.fn();
    const rendered = await render(SchemasCreateComponent, {
      imports: [FormsModule, MaterialModule],
      componentProperties: {
        save: {
          emit: saveEmitSpy,
        } as any
      }
    });
    return {
      ...rendered,
      click: (text: string) => userEvent.click(rendered.getByText(text)),
      clickByTitle: (title: string, times?: number) => {
        for (let index = 0; index < (times || 1); index++) {
          userEvent.click(rendered.getByTitle(title))
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
      saveNthCalledWith: (times: number, schema: Schema) => expect(saveEmitSpy).toHaveBeenNthCalledWith(times, schema),
    };
  }
});
