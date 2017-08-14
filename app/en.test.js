import React from 'react';
import Validation from './index';
import { mount } from 'enzyme';
import ERROR_CODES from './data/error-codes';
import ValidationClass from './validation';

describe('RU', () => {
    it('with english dictionary', () => {
        const wrapper = mount(
            <Validation>
                <span>1</span>
            </Validation>
        );
        expect(wrapper.find(ValidationClass).props().errorCodes).toEqual(
            ERROR_CODES
        );
    });
});
