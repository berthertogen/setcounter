import { Schema, SchemaDefault } from "./schema/schema";
import { SchemasService } from "./schemas.service";

describe('SchemasService', () => {
    test('get should load schemas from localStorage', async () => {
        const mockSchemas = [new SchemaDefault()];
        const { getItem } = mockLocalStorage(mockSchemas)
        const service = new SchemasService();

        const schemas = service.get();

        expect(schemas).toEqual(mockSchemas);
        expect(getItem).toHaveBeenCalledTimes(1);
    });

    test('get should return empty [] when localStorage doesnt have item', async () => {
        const service = new SchemasService();
        const { getItem } = mockLocalStorage();
        const schemas = service.get();

        expect(schemas).toEqual([]);
        expect(getItem).toHaveBeenCalledTimes(1);
    });

    test('add should add schema to schemas in localStorage', async () => {
        const mockSchema = new SchemaDefault();
        const { setItem } = mockLocalStorage();
        const service = new SchemasService();

        service.add(mockSchema);

        expect(setItem).toHaveBeenNthCalledWith(1, "setcounter-schemas", JSON.stringify([mockSchema]));
    });

    test('delete should remove the schema from schemas and update localStorage', async () => {
        const mockSchemas = [new SchemaDefault(), new SchemaDefault(), new SchemaDefault()];
        const { setItem } = mockLocalStorage(mockSchemas);
        const service = new SchemasService();

        service.remove(1);

        expect(setItem).toHaveBeenNthCalledWith(1, "setcounter-schemas", JSON.stringify([mockSchemas[0], mockSchemas[2]]));
    });

    function mockLocalStorage(schemas?: Schema[]) {
        const getItem = jest.fn();
        const setItem = jest.fn();
        getItem
            .mockReset()
            .mockImplementation(() => schemas ? JSON.stringify(schemas) : null);
        setItem
            .mockReset();
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem,
                setItem,
            },
            writable: true
        });
        return { getItem, setItem };
    }
});
