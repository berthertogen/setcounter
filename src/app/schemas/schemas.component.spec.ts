import { FormsModule } from '@angular/forms';
import { render, RenderResult } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { SchemasListComponent } from './list/list.component';
import { SchemasCreateComponent } from './schema/create/create.component';
import { ExerciseDefault, Schema, SchemaDefault } from './schema/schema';
import { Autofixture } from 'ts-autofixture/dist/src';

import { SchemasComponent } from './schemas.component';

describe('SchemasComponent', () => {
  test('should have title', async () => {
    const { hasText, notHasByTestId, hasByTestId } = await createComponent();

    hasText("Schema's");
    hasText("+ Create schema");
    hasByTestId('app-schemas-list');
    notHasByTestId('app-schemas-create');
  });

  test('should load schemas from localStorage', async () => {
    const schemas = mockSchemas();
    mockLocalStorage(schemas);
    const { schemasLoaded } = await createComponent();

    schemasLoaded(1, schemas);
  });

  test('should load create schema component when + Create schema button is clicked', async () => {
    const { click, hasByTestId, notHasByTestId, notHasText } = await createComponent();
    click('+ Create schema');

    notHasText("+ Create schema");
    hasByTestId('app-schemas-create');
    notHasByTestId('app-schemas-list');
  });

  test('should load list schema component and add schema to list when Save schema event is fired', async () => {
    mockLocalStorage([]);
    const { click, hasByTestId, notHasByTestId, hasText, hasTextCount, schemasSaved } = await createComponent();

    click('+ Create schema');
    click('Save schema');
    click('+ Create schema');
    click('Save schema');

    hasText("+ Create schema");
    notHasByTestId('app-schemas-create');
    hasByTestId('app-schemas-list');
    hasTextCount('Warmup 0 minutes', 2);
    schemasSaved(2, [[new SchemaDefault()], [new SchemaDefault(), new SchemaDefault()]]);
  });

  const getItem = jest.fn();
  const setItem = jest.fn();
  async function mockLocalStorage(schemas: Schema[]) {
    getItem
      .mockReset()
      .mockImplementation(() => JSON.stringify(schemas));
    setItem
      .mockReset();
  }

  function mockSchemas() {
    const schemaDefault = {
      ...new SchemaDefault(),
      exercises: [new ExerciseDefault()]
    };
    return new Autofixture().createMany<Schema>(schemaDefault);
  }

  async function createComponent() {
    const rendered = await render(SchemasComponent, {
      declarations: [SchemasCreateComponent, SchemasListComponent],
      imports: [FormsModule]
    });
    return createComponentWithExtras(rendered);
  }

  async function createComponentWithExtras(rendered: RenderResult<SchemasComponent, SchemasComponent>) {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem,
        setItem,
      },
      writable: true
    });
    return {
      ...rendered,
      click: (text: string) => userEvent.click(rendered.getByText(text)),
      hasText: (text: string) => rendered.getByText(text),
      notHasText: (text: string) => expect(rendered.queryByText(text)).toBeNull(),
      hasByTestId: (testId: string) => rendered.getByTestId(testId),
      notHasByTestId: (testId: string) => expect(rendered.queryByTestId(testId)).toBeNull(),
      hasTextCount: (text: string, count: number) => expect(rendered.getAllByText(text).length).toBe(count),
      schemasLoaded: (times: number, schemas: Schema[]) => {
        expect(getItem).toHaveBeenNthCalledWith(times, 'setcounter-schemas');
        expect(rendered.fixture.componentInstance.schemas).toEqual(schemas);
      },
      schemasSaved: (times: number, schemas: Schema[][]) => {
        expect(setItem).toHaveBeenCalledTimes(times);
        for (const schema of schemas) {
          expect(setItem).toHaveBeenCalledWith('setcounter-schemas', JSON.stringify(schema));
        }
      }
    };
  }
});
