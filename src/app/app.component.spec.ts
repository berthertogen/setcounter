import { FormsModule } from '@angular/forms';
import { render } from '@testing-library/angular';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { SchemasListComponent } from './schemas/list/list.component';
import { SchemasCreateComponent } from './schemas/schema/create/create.component';
import { SchemasComponent } from './schemas/schemas.component';
import { routes } from './app-routing.module';
import { SchemasRunComponent } from './schemas/schema/run/run.component';

describe('AppComponent', () => {
  test('should show schema list on load', async () => {
    const { hasByTestId } = await createComponent();

    hasByTestId('router-outlet');
  });

  async function createComponent() {
    const rendered = await render(AppComponent, {
      declarations: [SchemasComponent, SchemasCreateComponent, SchemasListComponent, SchemasRunComponent],
      imports: [FormsModule, MaterialModule],
      routes: routes,
    });
    return {
      ...rendered,
      hasByTestId: (testId: string) => rendered.getByTestId(testId),
    };
  }
});
