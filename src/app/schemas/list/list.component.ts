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

  schemas: Schema[] = this.schemasService.getAll();

  constructor(private router: Router, private schemasService: SchemasService) { }

  delete(schema: Schema) {
    this.schemasService.remove(schema.id);
    this.schemas = this.schemasService.getAll();
  }

  run(schema: Schema) {
    console.log(schema);
    this.router.navigate(['schemas', 'run', schema.id]);
  }
}
