// @flow

import React from 'react'
import Validation from './validation'
import ERROR_CODES from './data/error-codes'

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

export {default as ValidationInput} from './components/validation-input';
export {default as DisabledOnErrors} from './components/disabled-on-errors';
