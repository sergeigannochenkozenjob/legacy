export interface Item {
    id: string;
}

export interface Entity {
    getName: () => string;
    getDisplayName: () => string;
    getCamelName(): string;
    getFields: () => Field[];
    // castData(data: StringMap): StringMap;
}

export interface Schema {
    getEntity: (entityName: string) => Nullable<Entity>;
    getSchema(): Entity[];
}

export interface Field {
    getName: () => string;
    getDisplayName: () => string;
    isSortable: () => boolean;
    isReference: () => boolean;
    isRequired(): boolean;
    getActualType: () => string;
    isMultiple: () => boolean;
}
