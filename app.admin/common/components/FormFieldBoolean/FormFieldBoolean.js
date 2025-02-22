import React, { useState } from 'react';
import { FormField, FormFieldMultiplier, Add } from '..';
import { Checkbox, Check } from './style';

const Toggle = ({ field, value, onChange }) => {
    const [checked, setChecked] = useState(!!value);
    const [focused, setFocus] = useState(false);
    return (
        <Checkbox
            href="#"
            focus={focused}
            onClick={e => {
                setChecked(!checked);
                onChange({
                    target: {
                        value: !checked,
                        name: field.getName(),
                    },
                });
                e.preventDefault();
            }}
            onKeyPress={e => {
                if (e.key === ' ') {
                    setChecked(!checked);
                    onChange({
                        target: {
                            value: !checked,
                            name: field.getName(),
                        },
                    });
                }
            }}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
        >
            <Check checked={checked} />
        </Checkbox>
    );
};

export const FormFieldBoolean = ({ field, value, error, onChange }) => (
    <FormField
        field={field}
        error={error}
        actions={
            field.isMultiple() ? (
                <Add field={field} onChange={onChange} value={value} />
            ) : null
        }
    >
        <FormFieldMultiplier field={field} value={value} onChange={onChange}>
            {props => <Toggle {...props} />}
        </FormFieldMultiplier>
    </FormField>
);
