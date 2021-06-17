import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchemasListComponent } from './schemas/list/list.component';
import { SchemasCreateComponent } from './schemas/schema/create/create.component';
import { SchemasRunComponent } from './schemas/schema/run/run.component';
import { SchemasComponent } from './schemas/schemas.component';

export const routes: Routes = [
  {
    path: 'schemas',
    component: SchemasComponent,
    children: [
      { path: 'list', component: SchemasListComponent },
      { path: 'create', component: SchemasCreateComponent },
      { path: 'run/:id', component: SchemasRunComponent },
      { path: '**', redirectTo: 'list' },
    ],
  },
  { path: '**', redirectTo: 'schemas' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
