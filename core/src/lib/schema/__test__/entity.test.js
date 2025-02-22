import { Entity } from '../entity';
import {
    ENTITY_ID_FIELD_NAME,
    ENTITY_ID_FIELD_LENGTH,
} from '../../constants.both';
import { BooleanField, ReferenceField, StringField } from '../field';

describe('Entity', () => {
    describe('getSanitizedDeclaration()', () => {
        it('should normalize declaration', async () => {
            const entity = new Entity();

            expect(entity.declaration).toMatchObject({ name: '', schema: [] });
        });

        it('should make instances of fields', async () => {
            const entity = new Entity({
                name: 'sample',
                schema: [
                    {
                        name: 'i_have_a_name',
                        type: 'boolean',
                    },
                    {
                        name: 'i_have_a_name',
                        type: 'string',
                    },
                ],
            });

            const declaration = entity.declaration;

            expect(declaration.schema[0]).toBeInstanceOf(BooleanField);
            expect(declaration.schema[1]).toBeInstanceOf(StringField);
        });
    });

    describe('getHealth()', () => {
        it('should report on nameless entity', async () => {
            const entity = new Entity({
                schema: [
                    {
                        name: 'i_have_a_name',
                        type: 'boolean',
                    },
                ],
            });

            const errors = await entity.getHealth();

            expect(errors).toMatchObjectInArray({ code: 'entity_name_empty' });
        });

        it('should report on empty entity', async () => {
            const entity = new Entity({
                schema: [],
            });

            const errors = await entity.getHealth();

            expect(errors).toMatchObjectInArray({
                code: 'entity_schema_empty',
            });
        });

        it('should report on duplicate fields', async () => {
            const entity = new Entity({
                name: 'sample',
                schema: [
                    {
                        name: ENTITY_ID_FIELD_NAME,
                        type: 'string',
                        system: true,
                        unique: true,
                        length: ENTITY_ID_FIELD_LENGTH,
                    },
                    {
                        name: 'i_have_a_name',
                        type: 'boolean',
                    },
                    {
                        name: 'i_have_a_name',
                        type: 'string',
                    },
                ],
            });

            const errors = await entity.getHealth();
            expect(errors).toMatchObjectInArray({
                code: 'entity_field_duplicate',
                fieldName: 'i_have_a_name',
            });
        });

        it(`should report absence of ${ENTITY_ID_FIELD_NAME} field`, async () => {
            const name = 'test';
            const entity = new Entity({
                name,
                schema: [
                    {
                        name: 'i_have_a_name',
                        type: 'boolean',
                    },
                ],
            });

            const errors = await entity.getHealth();

            expect(errors).toMatchObjectInArray({
                code: 'entity_no_id_field',
            });
        });

        it('should report invalid fieldset health check', async () => {
            const name = 'test';
            const entity = new Entity({
                name,
                schema: [
                    {
                        name: 'i_have_a_name',
                        type: 'boolean',
                    },
                    {
                        name: ENTITY_ID_FIELD_NAME,
                        type: 'boolean',
                    },
                    {
                        name: '',
                        type: 'string',
                    },
                ],
            });

            const errors = await entity.getHealth();

            expect(errors).toMatchObjectInArray({
                code: 'field_name_empty',
                fieldName: '',
            });
            expect(errors).toMatchObjectInArray({
                code: 'field_not_system',
                fieldName: ENTITY_ID_FIELD_NAME,
            });
        });
    });

    describe('castData()', () => {
        it('should cast several fields', async () => {
            const entity = new Entity({
                name: 'test',
                schema: [
                    {
                        name: 'bool_field',
                        type: 'boolean',
                    },
                    {
                        name: 'integer_field',
                        type: 'integer',
                    },
                ],
            });

            let data = entity.castData({
                bool_field: '1111',
                integer_field: '1000',
            });

            expect(data).toEqual({ bool_field: true, integer_field: 1000 });
        });
    });

    describe('validateData()', () => {
        it('should validate several fields', async () => {
            const entity = new Entity({
                name: 'test',
                schema: [
                    {
                        name: 'bool_field',
                        type: 'boolean',
                    },
                    {
                        name: 'integer_field',
                        type: 'integer',
                    },
                ],
            });

            const errors = await entity.validateData({
                bool_field: '1111',
                integer_field: 'aaaa',
            });

            expect(errors).toMatchObjectInArray({
                fieldName: 'bool_field',
            });
            expect(errors).toMatchObjectInArray({
                fieldName: 'integer_field',
            });
        });
    });

    describe('getName()', () => {
        it('should return correct snake case name', async () => {
            const entity = new Entity({
                name: 'my_name_is_alice',
                schema: [],
            });

            expect(entity.getName()).toEqual('my_name_is_alice');
        });
    });

    describe('getCamelName()', () => {
        it('should return correct camel case name', async () => {
            const entity = new Entity({
                name: 'my_name_is_alice',
                schema: [],
            });

            expect(entity.getCamelName()).toEqual('MyNameIsAlice');
        });
    });

    describe('getDisplayName()', () => {
        it('should return correct space-separated name', async () => {
            const entity = new Entity({
                name: 'my_name_is_alice',
                schema: [],
            });

            expect(entity.getDisplayName()).toEqual('My name is alice');
        });
    });

    describe('getReferences()', () => {
        it('should return references', async () => {
            const entity = new Entity({
                name: 'sample',
                schema: [
                    {
                        name: 'i_have_a_name',
                        type: 'boolean',
                    },
                    {
                        name: 'single_ref',
                        type: 'referenced_entity_1',
                    },
                    {
                        name: 'multiple_ref',
                        type: ['referenced_entity_2'],
                    },
                ],
            });

            const result = entity.getReferences();
            expect(result).toHaveLength(2);

            expect(result[0]).toBeInstanceOf(ReferenceField);
            expect(result[0].getName()).toEqual('single_ref');

            expect(result[1]).toBeInstanceOf(ReferenceField);
            expect(result[1].getName()).toEqual('multiple_ref');
        });
    });

    describe('getSingleReferences()', () => {
        it('should return references', async () => {
            const entity = new Entity({
                name: 'sample',
                schema: [
                    {
                        name: 'i_have_a_name',
                        type: 'boolean',
                    },
                    {
                        name: 'single_ref',
                        type: 'referenced_entity_1',
                    },
                    {
                        name: 'multiple_ref',
                        type: ['referenced_entity_2'],
                    },
                ],
            });

            const result = entity.getSingleReferences();
            expect(result).toHaveLength(1);

            expect(result[0]).toBeInstanceOf(ReferenceField);
            expect(result[0].getName()).toEqual('single_ref');
        });
    });

    describe('getMultipleReferences()', () => {
        it('should return references', async () => {
            const entity = new Entity({
                name: 'sample',
                schema: [
                    {
                        name: 'i_have_a_name',
                        type: 'boolean',
                    },
                    {
                        name: 'single_ref',
                        type: 'referenced_entity_1',
                    },
                    {
                        name: 'multiple_ref',
                        type: ['referenced_entity_2'],
                    },
                ],
            });

            const result = entity.getMultipleReferences();
            expect(result).toHaveLength(1);

            expect(result[0]).toBeInstanceOf(ReferenceField);
            expect(result[0].getName()).toEqual('multiple_ref');
        });
    });

    describe('getPreviewField()', () => {
        it('should take first single string field as presentational', async () => {
            const entity = new Entity({
                name: 'sample',
                schema: [
                    {
                        name: 'i_have_a_name',
                        type: 'boolean',
                    },
                    {
                        name: 'single_ref',
                        type: 'referenced_entity_1',
                    },
                    {
                        name: 'i_am_presentational',
                        type: 'string',
                    },
                ],
            });

            const result = entity.getPreviewField();

            expect(result).toBeInstanceOf(StringField);
            expect(result.getName()).toEqual('i_am_presentational');
        });

        it('should take specified field as presentational', async () => {
            const entity = new Entity({
                name: 'sample',
                schema: [
                    {
                        name: 'i_have_a_name',
                        type: 'boolean',
                    },
                    {
                        name: 'single_ref',
                        type: 'referenced_entity_1',
                    },
                    {
                        name: 'i_am_not_presentational',
                        type: 'string',
                    },
                    {
                        name: 'i_am_presentational',
                        type: 'string',
                        preview: true,
                    },
                ],
            });

            const result = entity.getPreviewField();

            expect(result).toBeInstanceOf(StringField);
            expect(result.getName()).toEqual('i_am_presentational');
        });
    });
});
