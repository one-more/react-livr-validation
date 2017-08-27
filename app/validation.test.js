import React from 'react';
import { mount } from 'enzyme';
import Validation, { DisabledOnErrors, ValidationInput } from './index';
import ValidationClass from './validation';

const LOGIN = 'login';
const PASSWORD = 'password';

const schema = {
    [LOGIN]: ['required', 'not_empty'],
    [PASSWORD]: ['required', 'not_empty']
};

describe('Validation', () => {
    it('disabled submit with empty form', () => {
        const wrapper = mount(
            <Validation schema={schema} data={{}}>
                <form>
                    <ValidationInput>
                        <input type="text" name={PASSWORD} />
                    </ValidationInput>
                    <ValidationInput>
                        <input type="text" name={LOGIN} />
                    </ValidationInput>
                    <DisabledOnErrors>
                        <button type="submit">submit</button>
                    </DisabledOnErrors>
                </form>
            </Validation>
        );
        expect(wrapper.find('button').props().disabled).toBeTruthy();
    });

    it('active submit with filled form', () => {
        const wrapper = mount(
            <Validation
                schema={schema}
                data={{
                    [PASSWORD]: '123',
                    [LOGIN]: '456'
                }}
            >
                <form>
                    <ValidationInput>
                        <input type="text" name={PASSWORD} />
                    </ValidationInput>
                    <ValidationInput>
                        <input type="text" name={LOGIN} />
                    </ValidationInput>
                    <DisabledOnErrors>
                        <button type="submit">submit</button>
                    </DisabledOnErrors>
                </form>
            </Validation>
        );
        expect(wrapper.find('button').props().disabled).toBeFalsy();
    });

    it('show validation error', () => {
        const wrapper = mount(
            <Validation schema={schema} data={{}}>
                <form>
                    <ValidationInput
                        validateOnEvents={['change']}
                        name={PASSWORD}
                    >
                        <input type="text" name={PASSWORD} />
                    </ValidationInput>
                    <ValidationInput validateOnEvents={['change']} name={LOGIN}>
                        <input type="text" name={LOGIN} />
                    </ValidationInput>
                    <DisabledOnErrors>
                        <button type="submit">submit</button>
                    </DisabledOnErrors>
                </form>
            </Validation>
        );

        wrapper.find(`input[name="${PASSWORD}"]`).simulate('change', {
            target: {
                value: ''
            }
        });
        expect(
            wrapper.find(ValidationInput).at(0).find('[data-error-block]')
        ).toHaveLength(1);
        wrapper.find(`input[name="${LOGIN}"]`).simulate('change', {
            target: {
                value: ''
            }
        });
        expect(
            wrapper.find(ValidationInput).at(1).find('[data-error-block]')
        ).toHaveLength(1);
        expect(wrapper.find('button').props().disabled).toBeTruthy();

        wrapper.find(`input[name="${PASSWORD}"]`).simulate('change', {
            target: {
                value: '123'
            }
        });
        expect(wrapper.find(ValidationInput).at(0).find('div')).toHaveLength(1);
        wrapper.find(`input[name="${LOGIN}"]`).simulate('change', {
            target: {
                value: '456'
            }
        });
        expect(wrapper.find(ValidationInput).at(1).find('div')).toHaveLength(1);
        expect(wrapper.find('button').props().disabled).toBeFalsy();
    });

    it('update schema and data on receive props', () => {
        const wrapper = mount(
            <Validation schema={schema} data={{}}>
                <form>
                    <ValidationInput
                        validateOnEvents={['change']}
                        name={PASSWORD}
                    >
                        <input type="text" name={PASSWORD} />
                    </ValidationInput>
                    <ValidationInput validateOnEvents={['change']} name={LOGIN}>
                        <input type="text" name={LOGIN} />
                    </ValidationInput>
                    <DisabledOnErrors>
                        <button type="submit">submit</button>
                    </DisabledOnErrors>
                </form>
            </Validation>
        );
        const newSchema = {
            ...schema,
            [PASSWORD]: ['required', 'not_empty', { min_length: 10 }]
        };
        const createValidator = jest.spyOn(
            ValidationClass.prototype,
            'createValidator'
        );
        const validateData = jest.spyOn(
            ValidationClass.prototype,
            'validateData'
        );
        wrapper.setProps({
            schema: newSchema
        });
        expect(createValidator).toHaveBeenCalled();

        const nextData = {
            login: 1,
            password: 2
        };
        wrapper.setProps({
            data: nextData
        });
        expect(wrapper.find(ValidationClass).node.data).toEqual(nextData);
        expect(validateData).toHaveBeenCalledTimes(2);
    });

    it('custom rules and aliased rules', () => {
        const customRules = {
            alpha_chars: function() {
                return function(value) {
                    if (typeof value === 'string') {
                        if (!/[a-z,A-Z]+/.test(value)) {
                            return 'password should contain alpha chars';
                        }
                    }
                };
            }
        };
        const aliasedRules = [
            {
                name: 'strong_password',
                rules: { min_length: 6 },
                error: 'password should have length of 6'
            }
        ];
        const customSchema = {
            ...schema,
            [PASSWORD]: schema.password.concat([
                'strong_password',
                'alpha_chars'
            ])
        };
        const wrapper = mount(
            <Validation
                schema={customSchema}
                data={{}}
                rules={customRules}
                aliasedRules={aliasedRules}
            >
                <form>
                    <ValidationInput
                        validateOnEvents={['change']}
                        name={PASSWORD}
                    >
                        <input type="text" name={PASSWORD} />
                    </ValidationInput>
                    <ValidationInput validateOnEvents={['change']} name={LOGIN}>
                        <input type="text" name={LOGIN} />
                    </ValidationInput>
                    <DisabledOnErrors>
                        <button type="submit">submit</button>
                    </DisabledOnErrors>
                </form>
            </Validation>
        );
        const { validatorBuilders } = wrapper.find(
            ValidationClass
        ).node.validator;
        expect(validatorBuilders.strong_password).toEqual(expect.any(Function));
        expect(validatorBuilders.alpha_chars).toEqual(expect.any(Function));
    });
});
