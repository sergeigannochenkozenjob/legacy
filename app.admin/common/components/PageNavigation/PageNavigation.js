import React, { useMemo } from 'react';
import { PageNavigationContainer } from './style';
import Button from '../../material-kit/CustomButtons';

const getPageCount = (count, pageSize) => {
    return Math.ceil(count / pageSize);
};

const getRange = (count, page, pageSize = 10, radius = 2) => {
    const pageCount = getPageCount(count, pageSize);

    const r = [page - radius, page + radius];
    if (r[0] < 1) {
        r[1] += 1 - r[0];
        r[0] = 1;
        if (r[1] > pageCount) {
            r[1] = pageCount;
        }
    }

    if (r[1] > pageCount) {
        r[0] -= r[1] - pageCount;
        r[1] = pageCount;
        if (r[0] < 1) {
            r[0] = 1;
        }
    }

    return r;
};

const renderRange = (range, page, onNavigate) => {
    const result = [];

    for (let k = range[0]; k <= range[1]; k++) {
        result.push(
            <Button
                color="warning"
                size="sm"
                key={k}
                disabled={k === page}
                onClick={() => onNavigate(k)}
            >
                {k}
            </Button>,
        );
    }

    return result;
};

export const PageNavigation = ({ count, page, pageSize, onNavigate }) => {
    pageSize = pageSize || 10;

    const range = useMemo(() => {
        return getRange(count, page, pageSize);
    }, [count, page]);

    page = parseInt(page, 10);

    return (
        <PageNavigationContainer>
            <Button
                color="warning"
                size="sm"
                onClick={() => page > 1 && onNavigate(page - 1)}
            >
                &larr;
            </Button>
            {renderRange(range, page, onNavigate)}
            <Button
                color="warning"
                size="sm"
                onClick={() =>
                    page < getPageCount(count, pageSize) && onNavigate(page + 1)
                }
            >
                &rarr;
            </Button>
        </PageNavigationContainer>
    );
};
