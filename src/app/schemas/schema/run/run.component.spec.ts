import { Router } from '@angular/router';
import { fireEvent, render } from '@testing-library/angular';
import { DateTime } from 'luxon';
import { MaterialModule } from 'src/app/material.module';
import { Autofixture } from 'ts-autofixture/dist/src';
import { ExerciseDefault, Schema, SchemaDefault } from '../schema';

import { SchemasRunComponent } from './run.component';

describe('RunComponent', () => {
  test('should create', async () => {
    const { hasTitle, hasText, isDisabled, hasDigitalClockWithTicks, loadSchemaFromRoute, schemas } = await createComponent();

    hasText('1');
    hasText('Warmup');
    hasDigitalClockWithTicks(schemas[0].warmup, 0);
    hasTitle('Start');
    hasTitle('Pauze');
    isDisabled('Pauze');
    hasTitle('Reset');
    isDisabled('Reset');
    hasTitle('Start exercises');

    hasText('2');
    hasText('Exercises');

    hasText('3');
    hasText('Interval');

    loadSchemaFromRoute();
  });

  test('should count down when start warmup is clicked', async () => {
    jest.useFakeTimers();
    const { clickTitle, detectChanges, isDisabled, isEnabled, hasDigitalClockWithTicks, schemas } = await createComponent();

    clickTitle("Start");
    isDisabled('Start');
    isEnabled('Pauze');
    isEnabled('Reset');
    hasDigitalClockWithTicks(schemas[0].warmup, 0);
    jest.advanceTimersByTime(1000);
    detectChanges();
    hasDigitalClockWithTicks(schemas[0].warmup, 1);
    jest.advanceTimersByTime(1000);
    detectChanges();
    hasDigitalClockWithTicks(schemas[0].warmup, 2);


    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  async function createComponent() {
    const schemas = mockSchemas();
    const router = { getCurrentNavigation: jest.fn() };
    router.getCurrentNavigation.mockImplementation(() => ({
      extras: {
        state: {
          schema: JSON.stringify(schemas[0])
        }
      }
    }))
    const rendered = await render(SchemasRunComponent, {
      imports: [MaterialModule],
      providers: [
        { provide: Router, useValue: router }
      ]
    });
    return {
      ...rendered,
      schemas,
      clickTitle: (title: string) => fireEvent.click(rendered.getByTitle(title)),
      hasTitle: (title: string) => rendered.getByTitle(title),
      isDisabled: (title: string) => expect(rendered.getByTitle(title)).toBeDisabled(),
      isEnabled: (title: string) => expect(rendered.getByTitle(title)).toBeEnabled(),
      hasText: (text: string) => rendered.getByText(text),
      hasDigitalClockWithTicks: (minutes: number, ticks: number) => {
        const clockValue = DateTime
          .fromSeconds(minutes * 60)
          .minus({ seconds: ticks });
        rendered.getByText(clockValue.toFormat('mm:ss'));
      },
      loadSchemaFromRoute: () => expect(rendered.fixture.componentInstance.schema).toEqual(schemas[0])
    };
  }

  function mockSchemas() {
    const schemaDefault = {
      ...new SchemaDefault(),
      exercises: [new ExerciseDefault()]
    };
    return new Autofixture().createMany<Schema>(schemaDefault, 3, {
      warmup: "0 < integer < 60",
      intervalReps: '0 < integer < 20',
      intervalDuration: '0 < integer < 60',
      intervalPause: '0 < integer < 60',
    });
  }
});
