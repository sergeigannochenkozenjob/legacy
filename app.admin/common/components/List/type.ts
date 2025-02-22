import { Item, Field, Entity } from '../../lib/project-minimum-core';

export type ListCellType =
    | 'string'
    | 'datetime'
    | 'boolean'
    | 'integer'
    | 'other';

export interface ListCellReference {
    field?: Field;
    entity?: Entity;
}

export interface ListCell {
    name: string;
    displayName: string;
    type: ListCellType;
    multiple: boolean;
    sortable: boolean;
    renderer?: Nullable<Function>;
    reference: ListCellReference;
}

export type ListOrderType = 'asc' | 'desc';

export interface ListPropertyOrder {
    cell: string;
    way: ListOrderType;
}

export type ListPropertyItemActionGetHref = (item: Item) => string;
export type ListPropertyItemActionOnClick = (
    name: string,
    item: Item,
    closePanel: () => void,
) => void;

export interface ListPropertyItemAction {
    name: string;
    displayName: string;
    icon: string;
    getHref: Nullable<ListPropertyItemActionGetHref>;
    onClick: Nullable<ListPropertyItemActionOnClick>;
}

export interface ListProperties {
    columns: ListCell[];
    data: Item[];
    itemActions?: ListPropertyItemAction[];
    page: number;
    count: Nullable<number>;
    pageSize: number;
    sort: ListPropertyOrder;
    onPageChange: (page: number) => void;
    onSortChange: (order: ListPropertyOrder) => void;
    keyProperty: string;
}
