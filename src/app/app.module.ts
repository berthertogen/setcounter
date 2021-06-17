import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SchemasComponent } from './schemas/schemas.component';
import { SchemasCreateComponent } from './schemas/schema/create/create.component';
import { SchemasListComponent } from './schemas/list/list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { SchemasRunComponent } from './schemas/schema/run/run.component';

@NgModule({
  declarations: [AppComponent, SchemasComponent, SchemasCreateComponent, SchemasListComponent, SchemasRunComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule, MaterialModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
