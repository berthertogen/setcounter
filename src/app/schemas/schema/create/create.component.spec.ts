import { FormsModule } from '@angular/forms';
import { fireEvent, render } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { MaterialModule } from 'src/app/material.module';
import { ExerciseDefault, Schema } from 'src/app/schemas/schema/schema';
import { SchemasCreateComponent } from './create.component';

describe('CreateComponent', () => {
  test('should show warmup range, reps, sets, add exercise when clicking the create schema button', async () => {
    const { getByText, getByLabelText } = await createComponent();

    expect(getByLabelText('Warmup')).toBeDefined();
    expect(getByLabelText('Reps')).toBeDefined();
    expect(getByLabelText('Sets')).toBeDefined();
    expect(getByText('+ Add exercise')).toBeDefined();
    expect(getByLabelText('Pause between reps (sec)')).toBeDefined();
    expect(getByLabelText('Pause between sets (sec)')).toBeDefined();
    expect(getByLabelText('Interval repetitions')).toBeDefined();
    expect(getByLabelText('Interval duration (sec)')).toBeDefined();
    expect(getByLabelText('Interval pause (sec)')).toBeDefined();
  });

  test('should update warmup value when sliding the range', async () => {
    const { getByText, changeSlider, fixture } = await createComponent();

    changeSlider('Warmup', 2);

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

    clickByTitle('Plus rep', 4);

    expect(fixture.componentInstance.schema.exercise.reps).toBe(4);

    clickByTitle('Minus rep', 2);

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

    expect(fixture.componentInstance.schema.exercise.sets).toBe(4);

    clickByTitle('Minus set', 2);

    expect(fixture.componentInstance.schema.exercise.sets).toBe(2);
  });

  test('should add exercise to list and clear form when clicking Add exercise', async () => {
    const { getByText, fixture, click, clickByTitle } = await createComponent();

    clickByTitle('Plus rep', 4);
    clickByTitle('Plus set', 12);
    click('+ Add exercise');

    getByText("Reps 4 & Sets 12");

    expect(fixture.componentInstance.schema.exercise.reps).toBe(0);
    expect(fixture.componentInstance.schema.exercise.sets).toBe(0);
  });

  test('should remove excercise when user clicks on the - in the list', async () => {
    const { queryAllByText, click, clickByTitle, clickAllByTitle } = await createComponent();

    clickByTitle('Plus rep', 4);
    clickByTitle('Plus set', 12);
    click('+ Add exercise');

    clickByTitle('Plus rep', 4);
    clickByTitle('Plus set', 12);
    click('+ Add exercise');

    clickByTitle('Plus rep', 3);
    clickByTitle('Plus set', 15);
    click('+ Add exercise');

    expect(queryAllByText("Reps 4 & Sets 12").length).toBe(2);

    clickAllByTitle('Remove excercise', 1);

    expect(queryAllByText("Reps 4 & Sets 12").length).toBe(1);
    expect(queryAllByText("Reps 3 & Sets 15").length).toBe(1);
  });

  test('should update pauseReps value when sliding the range', async () => {
    const { getByText, change, fixture } = await createComponent();

    change('Pause between reps (sec)', '60');

    expect(fixture.componentInstance.schema.pauseReps).toBe(60);
    expect(getByText('60 seconds')).toBeDefined();
  });

  test('should update pauseSets value when sliding the range', async () => {
    const { getByText, change, fixture } = await createComponent();

    change('Pause between sets (sec)', '30');

    expect(fixture.componentInstance.schema.pauseSets).toBe(30);
    expect(getByText('30 seconds')).toBeDefined();
  });

  test('should update intervalReps value when typing the intervalReps', async () => {
    const { type, fixture } = await createComponent();

    type('Interval repetitions', '14');

    expect(fixture.componentInstance.schema.intervalReps).toBe(14);
  })

  test('should update intervalDuration value when sliding the range', async () => {
    const { getByText, change, fixture } = await createComponent();

    change('Interval duration (sec)', '20');

    expect(fixture.componentInstance.schema.intervalDuration).toBe(20);
    expect(getByText('20 seconds')).toBeDefined();
  });

  test('should update intervalPause value when sliding the range', async () => {
    const { getByText, change, fixture } = await createComponent();

    change('Interval pause (sec)', '20');

    expect(fixture.componentInstance.schema.intervalPause).toBe(20);
    expect(getByText('20 seconds')).toBeDefined();
  });

  test('should emit output when save schema is clicked', async () => {
    const { type, click, clickByTitle, change, changeSlider, saveNthCalledWith } = await createComponent();

    changeSlider('Warmup', 2);

    clickByTitle('Plus rep', 4);
    clickByTitle('Plus set', 12);
    click('+ Add exercise');

    clickByTitle('Plus rep', 3);
    clickByTitle('Plus set', 15);
    click('+ Add exercise');
    change('Pause between reps (sec)', '60');
    change('Pause between sets (sec)', '30');

    type('Interval repetitions', '14');
    change('Interval duration (sec)', '20');
    change('Interval pause (sec)', '10');

    click('Save schema');

    saveNthCalledWith(1, {
      warmup: 10,
      exercises: [
        {reps: 4, sets: 12},
        {reps: 3, sets: 15},
      ],
      exercise: new ExerciseDefault(),
      pauseReps: 60,
      pauseSets: 30,
      intervalReps: 14,
      intervalDuration: 20,
      intervalPause:10
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
      clickAndWait: async (text: string) => {
        userEvent.click(rendered.getByText(text));
        await rendered.fixture.whenStable();
      },
      clickByTitle: (title: string, times?: number) => {
        for (let index = 0; index < (times || 1); index++) {
          userEvent.click(rendered.getByTitle(title))
        }
      },
      clickAllByTitle: (title: string, indexToClick: number) => {
        userEvent.click(rendered.getAllByTitle(title)[indexToClick]);
      },
      change: (label: string, value: string) => fireEvent.change(rendered.getByLabelText(label), { target: { value } }),
      changeSlider: (label: string, addSteps: number) => {
        const input = rendered.getByLabelText(label);
        const keys = [...Array(addSteps).keys()].map(() => '{arrowright}');
        userEvent.type(input, keys.join());
      },
      type: (label: string, value: string) => userEvent.type(rendered.getByLabelText(label), value),
      saveNthCalledWith: (times: number, schema: Schema) => expect(saveEmitSpy).toHaveBeenNthCalledWith(times, schema),
    };
  }
});
