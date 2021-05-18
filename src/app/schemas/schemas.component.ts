import { Component, HostBinding, OnInit } from '@angular/core';
import { Schema } from './schema/schema';

@Component({
  selector: 'app-schemas',
  templateUrl: './schemas.component.html',
  styleUrls: ['./schemas.component.sass']
})
export class SchemasComponent implements OnInit {
  @HostBinding('attr.data-testid')  dataTestid = 'app-schemas';

  schemas: Schema[] = [];

  create = false;
  
  ngOnInit(): void {
    const schemasJson = localStorage.getItem('setcounter-schemas');
    if (schemasJson) {
      this.schemas = JSON.parse(schemasJson);
    }
  }
  
  createSchema() {
    this.create = true;
  }

  save(schema: Schema) {
    this.create = false;
    this.schemas.push(schema);
    localStorage.setItem('setcounter-schemas', JSON.stringify(this.schemas));
  }

  delete(schema: Schema) {
    const indexOf = this.schemas.indexOf(schema);
    this.schemas.splice(indexOf, 1);
    localStorage.setItem('setcounter-schemas', JSON.stringify(this.schemas));
  }
}
