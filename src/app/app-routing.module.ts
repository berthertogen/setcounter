import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchemasComponent } from './schemas/schemas.component';

export const routes: Routes = [
  { path: 'schemas', component: SchemasComponent },
  { path: '**', redirectTo: 'schemas' }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
