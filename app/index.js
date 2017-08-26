// @flow

import React from 'react';
import Validation from './validation';
import ERROR_CODES from './data/error-codes';

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

export { default as ValidationInput } from './components/validation-input';
export { default as DisabledOnErrors } from './components/disabled-on-errors';
export {
    default as ValidationComponent
} from './components/validation-component';
export { RU as RU_ERROR_CODES } from './data/error-codes';
