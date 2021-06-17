import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { MaterialModule } from 'src/app/material.module';
import { Schema } from 'src/app/schemas/schema/schema';
import { SchemasCreateComponent } from './create.component';

describe('CreateComponent - exercises', () => {
  test('should add exercise to list and clear form when clicking Add exercise', async () => {
    const { getByText, queryByText, fixture, click, clickByTitle } = await createComponent();

    clickByTitle('Plus rep', 1);
    clickByTitle('Plus set', 1);
    click('+ Add exercise');

    expect(queryByText('No exercises added yet.')).toBeNull();
    getByText('Reps 4 & Sets 13');

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

    expect(queryAllByText('Reps 4 & Sets 13').length).toBe(2);
    expect(queryAllByText('Reps 5 & Sets 14').length).toBe(1);

    clickAllByTitle('Remove excercise', 1);

    expect(queryAllByText('Reps 4 & Sets 13').length).toBe(1);
    expect(queryAllByText('Reps 5 & Sets 14').length).toBe(1);
  });
});

async function createComponent() {
  const rendered = await render(SchemasCreateComponent, {
    imports: [FormsModule, MaterialModule],
    providers: [{ provide: Router, useValue: { navigate: jest.fn() } }],
  });
  return {
    ...rendered,
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
  };
}
