import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Schema } from 'src/app/schemas/schema/schema';
import { SchemasService } from '../schemas.service';

@Component({
  selector: 'app-schemas-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class SchemasListComponent {

  schemas: Schema[] = this.schemasService.get();

  constructor(private router: Router, private schemasService: SchemasService) { }

  delete(schema: Schema) {
    const indexOf = this.schemas.indexOf(schema);
    this.schemasService.remove(indexOf);
  }

  run(schema: Schema) {
    this.router.navigate(['schemas', 'run'], {
      state: {
        schema: JSON.stringify(schema)
      }
    });
  }
}
