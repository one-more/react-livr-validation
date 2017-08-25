# React validation component

## usage

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
