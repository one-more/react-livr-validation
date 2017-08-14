// @flow

import React from 'react';
import Validation from '../app/validation';
import { RU as ERROR_CODES } from '../app/data/error-codes';

type Props = {
    children: any,
    errorCodes?: Object
};

export default function HOC({ children, errorCodes, ...rest }: Props) {
    return (
        <Validation {...rest} errorCodes={errorCodes || ERROR_CODES}>
            {children}
        </Validation>
    );
}

export { default as ValidationInput } from '../app/components/validation-input';
export {
    default as DisabledOnErrors
} from '../app/components/disabled-on-errors';
