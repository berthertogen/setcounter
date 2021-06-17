import { Schema, SchemaDefault } from "./schema/schema";
import { SchemasService } from "./schemas.service";

describe('SchemasService', () => {
    test('get should load schemas from localStorage', async () => {
        const mockSchemas = [new SchemaDefault()];
        const { getItem } = mockLocalStorage(mockSchemas)
        const service = new SchemasService();

        const schemas = service.getAll();

        expect(schemas).toEqual(mockSchemas);
        expect(getItem).toHaveBeenCalledTimes(1);
    });

    test('get should return empty [] when localStorage doesnt have item', async () => {
        const service = new SchemasService();
        const { getItem } = mockLocalStorage();
        const schemas = service.getAll();

        expect(schemas).toEqual([]);
        expect(getItem).toHaveBeenCalledTimes(1);
    });

    test('get(id) should return the correct schema', async () => {
        const mockSchemas = [new SchemaDefault(1), new SchemaDefault(2), new SchemaDefault(3)];
        const service = new SchemasService();
        const { getItem } = mockLocalStorage(mockSchemas);

        service.getOne(2).subscribe((schema) => {
            expect(schema).toEqual(mockSchemas[1]);
            expect(getItem).toHaveBeenCalledTimes(1);
        });
    });

    test('get(id) should throw error if schema is not found', async () => {
        const service = new SchemasService();
        mockLocalStorage();

        expect(() => service.getOne(5)).toThrowError(new RangeError(`No schema found for id ${5}`));
    });


    test('add should add schema to schemas in localStorage', async () => {
        const mockSchema = new SchemaDefault();
        const { setItem } = mockLocalStorage();
        const service = new SchemasService();

        service.add(new SchemaDefault());

        expect(setItem).toHaveBeenNthCalledWith(1, "setcounter-schemas", JSON.stringify([{
            ...new SchemaDefault(),
            id: 1
        }]));
    });

    test('delete should remove the schema from schemas and update localStorage', async () => {
        const mockSchemas = [new SchemaDefault(1), new SchemaDefault(2), new SchemaDefault(3)];
        const { setItem } = mockLocalStorage(mockSchemas);
        const service = new SchemasService();

        service.remove(2);

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
