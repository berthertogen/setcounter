import { ActivatedRoute } from '@angular/router';
import { fireEvent, render } from '@testing-library/angular';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { Autofixture } from 'ts-autofixture/dist/src';
import { SchemasService } from '../../schemas.service';
import { ExerciseDefault, Schema, SchemaDefault } from '../schema';

import { SchemasRunComponent } from './run.component';

describe('RunComponent', () => {
  test('should create', async () => {
    const { hasTitle, hasText, isDisabled, hasDigitalClockWithTicks, loadSchemaFromRoute, schemas } =
      await createComponent();

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
    const { clickTitle, detectChanges, isDisabled, isEnabled, hasDigitalClockWithTicks, schemas } =
      await createComponent();

    clickTitle('Start');
    jest.advanceTimersByTime(1);
    detectChanges();
    isDisabled('Start');
    isEnabled('Pauze');
    isEnabled('Reset');
    hasDigitalClockWithTicks(schemas[0].warmup, 1);
    jest.advanceTimersByTime(1000);
    detectChanges();
    hasDigitalClockWithTicks(schemas[0].warmup, 2);
    jest.advanceTimersByTime(1000);
    detectChanges();
    hasDigitalClockWithTicks(schemas[0].warmup, 3);

    jest.runOnlyPendingTimers();
  });

  test('should stop counting when pause is clicked and resume when start is clicked again', async () => {
    jest.useFakeTimers();
    const { clickTitle, hasDigitalClockWithTicks, isDisabled, isEnabled, detectChanges, schemas } = await createComponent();

    clickTitle("Start");
    jest.advanceTimersByTime(3000);
    detectChanges();
    hasDigitalClockWithTicks(schemas[0].warmup, 4);

    clickTitle("Pauze");
    isEnabled('Start');
    isDisabled('Pauze');
    isEnabled('Reset');
    jest.advanceTimersByTime(3000);
    detectChanges();
    hasDigitalClockWithTicks(schemas[0].warmup, 4);

    clickTitle("Start");
    isDisabled('Start');
    isEnabled('Pauze');
    isEnabled('Reset');
    jest.advanceTimersByTime(3000);
    detectChanges();
    hasDigitalClockWithTicks(schemas[0].warmup, 8);

    jest.runOnlyPendingTimers();
  });

  test('should reset timer when reset is clicked and stop if was running', async () => {
    jest.useFakeTimers();
    const { clickTitle, hasDigitalClockWithTicks, isDisabled, isEnabled, detectChanges, schemas } = await createComponent();

    clickTitle("Start");
    jest.advanceTimersByTime(3000);
    detectChanges();
    hasDigitalClockWithTicks(schemas[0].warmup, 4);

    clickTitle("Reset");
    isEnabled('Start');
    isDisabled('Pauze');
    isDisabled('Reset');
    jest.advanceTimersByTime(3000);
    detectChanges();
    hasDigitalClockWithTicks(schemas[0].warmup, 0);

    clickTitle("Start");
    jest.advanceTimersByTime(3000);
    detectChanges();
    hasDigitalClockWithTicks(schemas[0].warmup, 4);
    clickTitle("Pauze");
    clickTitle("Reset");
    jest.advanceTimersByTime(3000);
    detectChanges();
    hasDigitalClockWithTicks(schemas[0].warmup, 0);

    jest.runOnlyPendingTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  async function createComponent() {
    const { schemas, getOne } = mockSchemaService();
    const route = {
      snapshot: {
        paramMap: {
          get: jest.fn(),
        },
      },
    };
    route.snapshot.paramMap.get.mockImplementation(() => 5);
    const rendered = await render(SchemasRunComponent, {
      imports: [MaterialModule],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: SchemasService, useValue: { getOne } },
      ],
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
        const clockValue = DateTime.fromSeconds(minutes * 60).minus({ seconds: ticks });
        rendered.getByText(clockValue.toFormat('mm:ss'));
      },
      loadSchemaFromRoute: () => {
        expect(route.snapshot.paramMap.get).toHaveBeenCalledTimes(1);
        expect(getOne).toHaveBeenNthCalledWith(1, 5);
      },
    };
  }

  function mockSchemaService() {
    const schemaDefault = {
      ...new SchemaDefault(5),
      exercises: [new ExerciseDefault()],
    };
    const schemas = new Autofixture().createMany<Schema>(schemaDefault, 3, {
      warmup: '0 < integer < 60',
      intervalReps: '0 < integer < 20',
      intervalDuration: '0 < integer < 60',
      intervalPause: '0 < integer < 60',
    });
    const getOne = jest.fn();
    getOne.mockReset().mockImplementation(() => of(schemas[0]));
    return {
      schemas,
      getOne,
    };
  }
});
