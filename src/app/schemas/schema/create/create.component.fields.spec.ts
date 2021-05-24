import { FormsModule } from '@angular/forms';
import { fireEvent, render } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { MaterialModule } from 'src/app/material.module';
import { ExerciseDefault, Schema } from 'src/app/schemas/schema/schema';
import { SchemasCreateComponent } from './create.component';

describe('CreateComponent - fields', () => {

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
