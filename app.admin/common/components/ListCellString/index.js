import React from 'react';
import { ListCellStringContainer, Empty } from './style';

const ListCellString = ({ field, value }) => {
    if (typeof value === 'undefined' || value === null) {
        return <Empty>&mdash;</Empty>;
    }

    value = field.isMultiple() ? value.join(', ') : value;

    return <ListCellStringContainer>{value}</ListCellStringContainer>;
};

export default ListCellString;
