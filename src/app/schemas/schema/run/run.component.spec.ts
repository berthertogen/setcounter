import { Router } from '@angular/router';
import { render } from '@testing-library/angular';
import { MaterialModule } from 'src/app/material.module';
import { Autofixture } from 'ts-autofixture/dist/src';
import { ExerciseDefault, Schema, SchemaDefault } from '../schema';

import { SchemasRunComponent } from './run.component';

describe('RunComponent', () => {
  test('should create', async () => {
    const { hasTitle, hasText, loadSchemaFromRoute, schemas } = await createComponent();

    hasText('1');
    hasText('Warmup');
    hasText(`${schemas[0].warmup}:00`);
    hasTitle('Start warmup');
    hasTitle('Done');

    hasText('2');
    hasText('Exercises');

    hasText('3');
    hasText('Interval');

    loadSchemaFromRoute()
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
      hasTitle: (title: string) => rendered.getByTitle(title),
      hasText: (text: string) => rendered.getByText(text),
      loadSchemaFromRoute: () => expect(rendered.fixture.componentInstance.schema).toEqual(schemas[0])
    };
  }

  function mockSchemas() {
    const schemaDefault = {
      ...new SchemaDefault(),
      exercises: [new ExerciseDefault()]
    };
    return new Autofixture().createMany<Schema>(schemaDefault);
  }
});
