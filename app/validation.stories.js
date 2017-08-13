// @flow

import React, {Component} from 'react'
import {storiesOf} from '@storybook/react'
import styled from 'styled-components'
import Validation, {DisabledOnErrors, ValidationInput} from './index'

const LOGIN = 'login';
const PASSWORD = 'password';

const schema = {
    [LOGIN]: ['required', 'not_empty'],
    [PASSWORD]: ['required', 'not_empty']
};

const customSchema = {
    ...schema,
    [PASSWORD]: schema.password.concat(['strong_password', 'alpha_chars'])
};

const customRules = {
    alpha_chars: function() {
        return function(value) {
            if(typeof value == 'string') {
                if(!/[a-z,A-Z]+/.test(value)) {
                    return 'password should contain alpha chars'
                }
            }
        }
    }
};

const aliasedRules = [
    {
        name: 'strong_password',
        rules: {min_length: 6},
        error: 'password should have length of 6'
    }
];

storiesOf('Validation', module)
    .add('default', () => <Validation
        schema={schema}
        data={{}}
    >
        <form>
            <Row>
                <Label htmlFor={LOGIN}>
                    {LOGIN}
                </Label>
                <ValidationInput name={LOGIN} >
                    <Input
                        id={LOGIN}
                        type="text"
                        name={LOGIN}
                    />
                </ValidationInput>
            </Row>
            <Row>
                <Label htmlFor={PASSWORD}>
                    {PASSWORD}
                </Label>
                <ValidationInput name={PASSWORD} >
                    <Input
                        id={PASSWORD}
                        type="password"
                        name={PASSWORD}
                    />
                </ValidationInput>
            </Row>
            <DisabledOnErrors>
                <Input type="submit" />
            </DisabledOnErrors>
        </form>
    </Validation>)
    .add('custom validation rules', () => <Validation
        schema={customSchema}
        aliasedRules={aliasedRules}
        rules={customRules}
        data={{}}
    >
        <form>
            <Row>
                <Label htmlFor={LOGIN}>
                    {LOGIN}
                </Label>
                <ValidationInput name={LOGIN} >
                    <Input
                        id={LOGIN}
                        type="text"
                        name={LOGIN}
                    />
                </ValidationInput>
            </Row>
            <Row>
                <Label htmlFor={PASSWORD}>
                    {PASSWORD}
                </Label>
                <ValidationInput name={PASSWORD} >
                    <Input
                        id={PASSWORD}
                        type="password"
                        name={PASSWORD}
                    />
                </ValidationInput>
            </Row>
            <DisabledOnErrors>
                <Input type="submit" />
            </DisabledOnErrors>
        </form>
    </Validation>)
    .add('styled error block', () => <Validation
        schema={schema}
        data={{}}
        style={{
            color: 'maroon',
            fontWeight: 'bold'
        }}
        className="custom CN"
    >
        <form>
            <Row>
                <Label htmlFor={LOGIN}>
                    {LOGIN}
                </Label>
                <ValidationInput name={LOGIN} >
                    <Input
                        id={LOGIN}
                        type="text"
                        name={LOGIN}
                    />
                </ValidationInput>
            </Row>
            <Row>
                <Label htmlFor={PASSWORD}>
                    {PASSWORD}
                </Label>
                <ValidationInput
                    name={PASSWORD}
                >
                    <Input
                        id={PASSWORD}
                        type="password"
                        name={PASSWORD}
                    />
                </ValidationInput>
            </Row>
            <DisabledOnErrors>
                <Input type="submit" />
            </DisabledOnErrors>
        </form>
    </Validation>);

const Input = styled.input`
    margin-top: 10px;
`;

const Row = styled.div`
    display: flex;
`;

const Label = styled.label`
    width: 74px;
    margin-top: 12px;
`;