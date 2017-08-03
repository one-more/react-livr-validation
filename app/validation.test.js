import React from 'react';
import {mount} from 'enzyme';
import Validation, {DisabledOnErrors, ValidationInput} from './index';

const LOGIN = 'login';
const PASSWORD = 'password';

const schema = {
    [LOGIN]: 'required',
    [PASSWORD]: 'required'
};

describe('Validation', () => {
    it('disabled submit with empty form', () => {
        const wrapper = mount(<Validation schema={schema} data={{}} >
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
        </Validation>);
        expect(wrapper.find('button').props().disabled).toBeTruthy();
    });

    it('active submit with filled form', () => {
        const wrapper = mount(<Validation
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
        </Validation>);
        expect(wrapper.find('button').props().disabled).toBeFalsy();
    });

    it('show validation error', () => {
        const wrapper = mount(<Validation schema={schema} data={{}} >
            <form>
                <ValidationInput validateOnEvents={['change']} name={PASSWORD} >
                    <input type="text" name={PASSWORD} />
                </ValidationInput>
                <ValidationInput validateOnEvents={['change']} name={LOGIN} >
                    <input type="text" name={LOGIN} />
                </ValidationInput>
                <DisabledOnErrors>
                    <button type="submit">submit</button>
                </DisabledOnErrors>
            </form>
        </Validation>);

        wrapper.find(`input[name="${PASSWORD}"]`).simulate('change', {
            target: {
                value: ''
            }
        });
        expect(wrapper.find(ValidationInput).at(0).find('div')).toHaveLength(2);
        wrapper.find(`input[name="${LOGIN}"]`).simulate('change', {
            target: {
                value: ''
            }
        });
        expect(wrapper.find(ValidationInput).at(1).find('div')).toHaveLength(2);
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
});
