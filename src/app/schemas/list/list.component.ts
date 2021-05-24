import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Schema } from 'src/app/schemas/schema/schema';

@Component({
  selector: 'app-schemas-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class SchemasListComponent implements OnInit {

  schemas: Schema[] = [];

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
}
