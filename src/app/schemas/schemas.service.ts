import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Schema, SchemaDefault } from "./schema/schema";

@Injectable({ providedIn: 'root' })
export class SchemasService {
    remove(id: number) {
        let schemas = this.getAll();
        const index = schemas.findIndex(schema => schema.id === id);
        schemas.splice(index, 1)
        this.set(schemas);
    }

    add(schema: Schema) {
        let schemas = this.getAll();
        schema.id = schemas.length + 1;
        schemas.push(schema);
        this.set(schemas);
    }

    getAll(): Schema[] {
        const schemas = localStorage.getItem("setcounter-schemas");
        return schemas
            ? JSON.parse(schemas) as Schema[]
            : [];
    }

    getOne(id: number): Observable<Schema> {
        let schemas = this.getAll();
        const schema = schemas.find(schema => schema.id === id);
        if (!schema)
            throw new RangeError(`No schema found for id ${id}`);
        return of(schema);
    }

    private set(schemas: Schema[]) {
        localStorage.setItem("setcounter-schemas", JSON.stringify(schemas));
    }
}