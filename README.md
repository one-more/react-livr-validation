# React validation component

### usage

```` es6
import React from 'react';
import Validation, {DisabledOnErrors, ValidationInput} from 'react-livr-validation';

const schema = {
    login: ['required', 'not_empty'],
    password: ['required', 'not_empty']
};

const data = {
    login: '',
    password: ''
};

export default function() {
    return (
        <Validation
            data={data}
            schema={schema}
        >
            <form>
                <ValidationComponent name="login" >
                    <input name="login" >
                </ValidationComponent>
                <ValidationComponent name="password" >
                    <input name="password" type="password" >
                </ValidationComponent>
                <DisabledOnErrors>
                    <Input type="submit" />
                </DisabledOnErrors>
            </form>
        </Validation>
    );   
}
````
### custom rules
```` es6
const customRules = {
    alpha_chars: function() {
        return function(value) {
            if (typeof value === 'string') {
                if (!/[a-z,A-Z]+/.test(value)) {
                    return 'WRONG_FORMAT';
                }
            }
        };
    }
};
const aliasedRules = [
    {
        name: 'strong_password',
        rules: { min_length: 6 },
        error: 'TOO_SHORT'
    }
];
const schema = {
    login: ['required', 'not_empty'],
    password: ['alpha_chars', 'strong_password']
}
const data = {
    login: '',
    password: ''
}
export default function() {
    return (
        <Validation
            data={data}
            schema={schema}
            rules={customRules}
            aliasedRules={aliasedRules}
        >
            // ... form
        </Validation>
    );   
}
````

### styled error block
```` es6
export default function() {
    return (
        <Validation
            data={data}
            schema={schema}
            style={{
                color: 'maroon',
                fontWeight: 'bold'
            }}
            className="custom CN"
        >
            // ... form
        </Validation>
    );   
}
````

### pass error codes dictionary
```` es6
const errorCodes = {
    TOO_SHORT: 'password is too short'
}
export default function() {
    return (
        <Validation
            data={data}
            schema={schema}
            errorCodes={errorCodes}
        >
            // ... form
        </Validation>
    );   
}
````

### write your own validation component
```` es6
// @flow

import React, {Component} from 'react'
import {ValidationComponent} from 'react-livr-validation'
import get from 'lodash/get'
import noop from 'lodash/noop'
import compose from 'ramda/src/compose'
import styled from 'styled-components'

type DataChunk = {
    name: string,
    value: any
}

type State = {
    touched: boolean
}

type Props = {
    // will be passed by HOC
    setData: (data: DataChunk) => void,
    getError: (name: string) => ?string,
    getErrors: () => Object,
    className: string, // for the error block
    style: Object // for the error block
    errorCodes: Object,
    
    name: string,
    field: string
}

class NestedError extends Component {
    props: Props;
    
    isTouched() {
        const {children} = this.props;
        return get(children, 'props.value')
    }
    
    state: State = {
        touched: this.isTouched()
    }
    
    setTouched() {
        this.setState({
            touched: true
        })
    }
    
    cloneElement() {
        const {children} = this.props;
        const onBlur = get(children, 'props.onBlur', noop);
        return React.cloneElement(
            children,
            {
                onBlur: compose(this.setTouched, onBlur)
            }
        )
    }
    
    render() {
        const {touched} = this.state;
        const {
            children, 
            field, 
            name, 
            getError,
            errorCodes,
            style,
            className
        } = this.props;
        const errors = getErrors();
        const error = get(errors, `${field}`.${name});
        return (
            <div>
                {touched ? children : this.cloneElement()}
                {error &&
                    <Error
                        className={className}
                        style={style}
                    >
                        {errorCodes[error] || error}
                    </Error
                }
            </div>
        );
    }
}

const Error = styled.div`
    color: red;
`;

export default ValidationComponent(NestedError)

````

## Classes
### Validation
|prop          | type     | default value |
|--------------|----------|---------------|
| data         | object   | {}            |
| schema       | object   | {}            |
| rules        | object   | {}            |
| aliasedRules | object   | {}            |
| className    | string   | ''            |
| style        | object   | {}            |
| errorCodes   | object   | {}            |

### ValidationInput
|prop              | type     | default value               |
|------------------|----------|-----------------------------|
| name             | string   | ''                          |
| validateOnEvents | array    | ['change', 'blur', 'keyUp'] |

