import { Router } from '@angular/router';
import { render } from '@testing-library/angular';
import { MaterialModule } from 'src/app/material.module';
import { Autofixture } from 'ts-autofixture/dist/src';
import { ExerciseDefault, Schema, SchemaDefault } from '../schema';

import { SchemasRunComponent } from './run.component';

describe('RunComponent', () => {
  test('should create', async () => {
    const { hasText, loadSchemaFromRoute } = await createComponent();

    hasText('run works!');
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
