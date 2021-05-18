import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Schema } from 'src/app/schemas/schema/schema';

@Component({
  selector: 'app-schemas-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class SchemasListComponent {
  @HostBinding('attr.data-testid')  dataTestid = 'app-schemas-list';

  @Input() schemas: Schema[] = [];

  @Output() delete = new EventEmitter<Schema>();
}
