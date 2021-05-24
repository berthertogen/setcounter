import { FormsModule } from '@angular/forms';
import { render } from '@testing-library/angular';
import { SchemasListComponent } from './list/list.component';
import { SchemasCreateComponent } from './schema/create/create.component';

import { SchemasComponent } from './schemas.component';
import { MaterialModule } from '../material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../app-routing.module';
import { SchemasRunComponent } from './schema/run/run.component';

describe('SchemasComponent', () => {
  test('should have title', async () => {
    const { hasText } = await createComponent();

    hasText("Schema's");
  });

  async function createComponent() {
    const rendered = await render(SchemasComponent, {
      declarations: [SchemasCreateComponent, SchemasListComponent, SchemasRunComponent],
      imports: [FormsModule, MaterialModule, RouterTestingModule.withRoutes(routes)]
    });
    return {
      ...rendered,
      hasText: (text: string) => rendered.getByText(text),
    };
  }
});
