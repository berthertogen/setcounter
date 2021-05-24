import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Schema } from 'src/app/schemas/schema/schema';

@Component({
  selector: 'app-schemas-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class SchemasListComponent implements OnInit {

  schemas: Schema[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    const schemasJson = localStorage.getItem('setcounter-schemas');
    if (schemasJson) {
      this.schemas = JSON.parse(schemasJson);
    }
  }

  delete(schema: Schema) {
    const indexOf = this.schemas.indexOf(schema);
    this.schemas.splice(indexOf, 1);
    localStorage.setItem('setcounter-schemas', JSON.stringify(this.schemas));
  }

  run(schema: Schema) {
    this.router.navigate(['schemas', 'run'], {
      state: {
        schema: JSON.stringify(schema)
      }
    });
  }
}
