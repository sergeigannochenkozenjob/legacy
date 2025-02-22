import {
    ENTITY_ID_FIELD_NAME,
    ENTITY_PK_FIELD_NAME,
} from 'project-minimum-core';

export default {
    important_person: [
        {
            [ENTITY_PK_FIELD_NAME]: 1,
            [ENTITY_ID_FIELD_NAME]: '4ef6f520-d180-4aee-9517-43214f396609',
            full_name: 'Max Mustermann',
            tags: ['one', 'two'],
            birth_date: new Date('2019-03-10T07:20:29.084Z'),
            has_pets: true,
            lucky_numbers: [123, 456],
            partner: 2,
        },
        {
            [ENTITY_PK_FIELD_NAME]: 2,
            [ENTITY_ID_FIELD_NAME]: '9e9c4ee3-d92e-48f2-8235-577806c12534',
            full_name: 'Mister Twister',
            tags: ['five', 'two'],
            birth_date: new Date('2019-06-10T19:53:14.084Z'),
            has_pets: false,
            lucky_numbers: [5],
            partner: null,
        },
        {
            [ENTITY_PK_FIELD_NAME]: 3,
            [ENTITY_ID_FIELD_NAME]: '2a98f71a-a3f6-43a1-8196-9a845ba8a54f',
            full_name: 'Sonoya Mizuno',
            tags: null,
            birth_date: new Date('2019-06-12T15:46:45.021Z'),
            has_pets: false,
            lucky_numbers: [3],
            partner: null,
        },
    ],
    pet: [
        {
            [ENTITY_PK_FIELD_NAME]: 1,
            [ENTITY_ID_FIELD_NAME]: '01f6f520-d180-4aee-9517-43214f396609',
            nickname: 'Viva',
        },
        {
            [ENTITY_PK_FIELD_NAME]: 2,
            [ENTITY_ID_FIELD_NAME]: '02f6f520-d180-4aee-9517-43214f396609',
            nickname: 'Java',
        },
        {
            [ENTITY_PK_FIELD_NAME]: 3,
            [ENTITY_ID_FIELD_NAME]: '03f6f520-d180-4aee-9517-43214f396609',
            nickname: 'Alchie',
        },
    ],
};
