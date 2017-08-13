// @flow

import React from 'react'
import Validation from '../app/validation'
import {RU as ERROR_CODES} from '../app/data/error-codes'

export default function HOC({children, errorCodes, ...rest}) {
    return (
        <Validation
            {...rest}
            errorCodes={errorCodes || ERROR_CODES}
        >
            {children}
        </Validation>
    )
}
HOC.defaultProps = {
    errorsCodes: ERROR_CODES
};

export {default as ValidationInput} from '../app/components/validation-input';
export {default as DisabledOnErrors} from '../app/components/disabled-on-errors';
