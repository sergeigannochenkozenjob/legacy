import { Table, TableColumn } from 'typeorm';

const TABLE_PREFIX = 'eq_e_';

export default class DBDiff {
    /**
     * So this function calculates a set of commands that are to execute to set the database in sync with data structure
     * @param params
     * @returns {Promise<void>}
     */
    static async make(params = {}) {
        const { entityProvider, connection } = params;

        const qr = (await connection.getConnection()).createQueryRunner(
            'master',
        );
        // get all entity tables
        const eTableNames = (await qr.query(
            `select * from information_schema.tables where table_schema='public' and table_name like '${TABLE_PREFIX}%'`,
        )).map(t => t.table_name);

        let tables = [];
        if (_.iane(eTableNames)) {
            tables = await qr.getTables(eTableNames);
        }

        const toCreate = [];
        const toDrop = [];
        const toAlter = [];

        const have = {};
        tables.forEach(table => {
            have[table.name] = table;
        });

        const entities = await entityProvider.get();
        const willBe = {};
        entities.forEach(entity => {
            const table = this.getDDL(entity);
            willBe[table.name] = table;
            if (!(table.name in have)) {
                toCreate.push(table);
            } else {
                toAlter.push(table);
            }
        });

        // tables to drop
        Object.values(have).forEach(table => {
            if (!(table.name in willBe)) {
                toDrop.push(table);
            }
        });

        if (_.iane(toCreate)) {
            for (let i = 0; i < toCreate.length; i++) {
                await qr.createTable(new Table(toCreate[i]), true);
            }
        }

        if (_.iane(toDrop)) {
            for (let i = 0; i < toDrop.length; i++) {
                await qr.dropTable(toDrop[i], true);
            }
        }

        // now the "field" level
        for (let i = 0; i < toAlter.length; i++) {
            const table = toAlter[i];
            const cTable = have[table.name];

            const tableFNames = Object.keys(
                table.columns.reduce((result, item) => {
                    result[item.name] = true;
                    return result;
                }, {}),
            );

            const cTableFNames = Object.keys(
                cTable.columns.reduce((result, item) => {
                    result[item.name] = true;
                    return result;
                }, {}),
            );

            const fAdd = _.difference(tableFNames, cTableFNames);
            const fDel = _.difference(cTableFNames, tableFNames);

            for (let i = 0; i < table.columns.length; i++) {
                const field = table.columns[i];
                if (fAdd.indexOf(field.name) >= 0) {
                    await qr.addColumn(table.name, new TableColumn(field));
                }
            }

            for (let i = 0; i < cTable.columns.length; i++) {
                const field = cTable.columns[i];
                if (fDel.indexOf(field.name) >= 0) {
                    await qr.dropColumn(cTable.name, field.name);
                }
            }

            // todo: support altering of fields
        }

        // console.log(require('util').inspect(toAlter, {depth: 10}));
        // console.log(require('util').inspect(toDrop, {depth: 10}));
    }

    static getDDL(entity) {
        const table = {
            name: `${TABLE_PREFIX}${entity.name.toLowerCase()}`.substr(0, 63),
            columns: [],
        };

        // add two "system" fields: id and code (external code)
        table.columns.push({
            isNullable: false,
            isGenerated: false,
            isPrimary: true,
            isUnique: true,
            isArray: false,
            length: '',
            zerofill: false,
            unsigned: true,
            name: 'id',
            type: 'integer',
        });
        table.columns.push({
            isNullable: false,
            isGenerated: false,
            isPrimary: false,
            isUnique: true,
            isArray: false,
            length: '300',
            zerofill: false,
            unsigned: false,
            name: 'code',
            type: 'character varying',
        });

        entity.schema.forEach(field => {
            table.columns.push({
                isNullable: field.required !== true,
                isGenerated: false,
                isPrimary: false,
                isUnique: false,
                isArray: _.isArray(field.type),
                length: this.getDDLLength(field),
                zerofill: false,
                unsigned: false,
                name: field.name,
                type: this.getDDLType(field),
            });
        });

        return table;
    }

    static getDDLType(field) {
        let type = field.type;

        if (_.isArray(type)) {
            type = type[0] || String;
        }

        if (type === 'reference') {
            return Number; // id
        }

        if (type === Number) {
            return 'integer'; // todo: add float support
        }

        if (type === Boolean) {
            return 'boolean';
        }

        if (type === Date) {
            return 'timestamp without time zone';
        }

        // the rest - just a string type
        return 'character varying';
    }

    static getDDLLength(field) {
        const type = this.getDDLType(field);
        if (type === 'character varying') {
            const length = parseInt(field.length, 10);
            if (isNaN(length)) {
                return '255';
            }

            return length.toString();
        }

        return '';
    }
}
