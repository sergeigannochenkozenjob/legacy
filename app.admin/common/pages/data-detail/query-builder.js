import gql from 'graphql-tag';
import { sanitize } from '../../lib/util';
import { ENTITY_CODE_FIELD_NAME } from '../../../shared/constants';

export default ({ entity, schema, code }) => {
    const selectedFields = entity.getFields().map(field => {
        const name = field.getName();
        if (field.isReference()) {
            let presentField = null;
            const refEntity = schema.getEntity(field.getReferencedEntityName());
            if (refEntity) {
                presentField = refEntity.getPresentationField();
            }

            return `${sanitize(name)} { ${ENTITY_CODE_FIELD_NAME} ${
                presentField ? presentField.getName() : ''
            } }`;
        }

        return sanitize(name);
    });

    const queryName = `${entity.getCamelName()}Get`;

    return gql`
        query {
            ${sanitize(queryName)}(code: "${sanitize(code)}") {
                errors {
                    code
                    message
                }
                data {
                    ${selectedFields.join('\n')}
                }
            }
        }        
    `;
};
