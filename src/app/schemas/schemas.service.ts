import { Injectable } from "@angular/core";
import { Schema } from "./schema/schema";

@Injectable({ providedIn: 'root' })
export class SchemasService {
    remove(index: number) {
        let schemas = this.get();
        schemas.splice(index, 1)
        this.set(schemas);
        console.log(schemas);
    }

    add(schema: Schema) {
        let schemas = this.get();
        schemas.push(schema);
        this.set(schemas);
    }

    get(): Schema[] {
        const item = localStorage.getItem("setcounter-schemas");
        return item
            ? JSON.parse(item) as Schema[]
            : [];
    }

    private set(schemas: Schema[]) {
        localStorage.setItem("setcounter-schemas", JSON.stringify(schemas));
    }
}