// @flow

import React, {Component} from 'react';
import capitalize from 'lodash/capitalize';
import noop from 'lodash/noop';
import styled from 'styled-components';
import compose from 'ramda/src/compose';
import {normalizeOnChangeEvent} from 'utils';
import ContextTypes from '../types/context-types';
import ERROR_CODES from '../data/error-codes';

type Props = {
    name: string,
    validateOnEvents: Array<string>,
    children: any
};

export default class ValidationInput extends Component {
    static contextTypes = ContextTypes;

    static defaultProps = {
        children: null,
        validateOnEvents: [],
        name: ''
    };

    eventHandler = (e: Object) => {
        const {target: {value}} = e;
        const {setData} = this.context;
        const {name} = this.props;
        setData({name, value});
    };

    onEvent = compose(this.eventHandler, normalizeOnChangeEvent);

    props: Props;

    cloneElement() {
        const {validateOnEvents, children} = this.props;
        const eventNames = validateOnEvents.map((event: string) => `on${capitalize(event)}`);
        const props = eventNames.reduce((acc: Object, event: string) => {
            const {props: childrenProps} = children;
            acc[event] = (e: Object) => {
                (childrenProps[event] || noop)(e);
                this.onEvent(e);
            };
            return acc;
        }, {});
        return React.cloneElement(
            children,
            props
        );
    }

    render() {
        const {name} = this.props;
        const {getError} = this.context;
        const error = getError(name);
        const element = this.cloneElement();
        return (
            <div>
                {element}
                {error &&
                    <Error>
                        {ERROR_CODES[error] || error}
                    </Error>
                }
            </div>
        );
    }
}

const Error = styled.div`
    color: red;
    padding-top: 4px;
`;
