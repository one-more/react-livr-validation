import React from 'react';
import Validation from './index';
import { mount } from 'enzyme';
import { RU as ERROR_CODES } from '../app/data/error-codes';
import ValidationClass from '../app/validation';

describe('RU', () => {
    it('with russian dictionary', () => {
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
