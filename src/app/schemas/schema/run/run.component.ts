import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Schema, SchemaDefault } from '../schema';

@Component({
  selector: 'app-schemas-run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.sass']
})
export class SchemasRunComponent {

  schema: Schema = new SchemaDefault();

  constructor(private router: Router) { 
    const extras = this.router.getCurrentNavigation();
    if (extras && extras.extras.state)  {
      this.schema = JSON.parse(extras.extras.state.schema);
    }
  }
}
