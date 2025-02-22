import {
    ENTITY_ID_FIELD_NAME,
    ENTITY_ID_FIELD_LENGTH,
} from 'project-minimum-core';

export default [
    {
        name: 'important_person',
        schema: [
            {
                name: ENTITY_ID_FIELD_NAME,
                type: 'string',
                label: 'Id',
                length: ENTITY_ID_FIELD_LENGTH,
                unique: true,
                system: true,
            },
            {
                name: 'full_name',
                type: 'string',
                label: 'Full name',
                required: true,
            },
            { name: 'tags', type: ['string'], label: 'Tags' },
            {
                name: 'lucky_numbers',
                type: ['integer'],
                label: 'Lucky numbers',
            },
            { name: 'birth_date', type: 'datetime', label: 'Birth date' },
            { name: 'has_pets', type: 'boolean', label: 'Has pets' },
            { name: 'pets', type: ['pet'], label: 'Pets' },
            { name: 'tools', type: ['tool'], label: 'Tools' },
            { name: 'partner', type: 'important_person', label: 'Partner' },
        ],
    },
    {
        name: 'pet',
        schema: [
            {
                name: ENTITY_ID_FIELD_NAME,
                type: 'string',
                label: 'Id',
                length: ENTITY_ID_FIELD_LENGTH,
                unique: true,
                system: true,
            },
            {
                name: 'nickname',
                type: 'string',
                label: 'Nickname',
                required: true,
            },
        ],
    },
    {
        name: 'tool',
        schema: [
            {
                name: ENTITY_ID_FIELD_NAME,
                type: 'string',
                label: 'Id',
                length: ENTITY_ID_FIELD_LENGTH,
                unique: true,
                system: true,
            },
            { name: 'name', type: 'string', label: 'Name', required: true },
        ],
    },
];
