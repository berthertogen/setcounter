import { FormsModule } from '@angular/forms';
import { render } from '@testing-library/angular'
import { AppComponent } from './app.component';
import { SchemasListComponent } from './schemas/list/list.component';
import { SchemasCreateComponent } from './schemas/schema/create/create.component';
import { SchemasComponent } from './schemas/schemas.component';

describe('AppComponent', () => {

  test('should show schema list on load', async () => {
    const { hasByTestId } = await createComponent();

    hasByTestId("app-schemas");
  });

  async function createComponent() {
    const rendered = await render(AppComponent, {
      declarations: [SchemasComponent, SchemasCreateComponent, SchemasListComponent],
      imports: [FormsModule]
    });
    return {
      ...rendered,
      hasByTestId: (testId: string) => rendered.getByTestId(testId)
    };
  }
});
