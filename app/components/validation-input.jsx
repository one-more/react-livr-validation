/* eslint no-param-reassign: 0 */
/* eslint react/sort-comp: 0 */
// @flow

import React, {Component} from 'react';
import noop from 'lodash/noop';
import styled from 'styled-components';
import compose from 'ramda/src/compose';
import concat from 'ramda/src/concat';
import partial from 'ramda/src/partial';
import converge from 'ramda/src/converge';
import head from 'ramda/src/head';
import slice from 'ramda/src/slice';
import toUpper from 'ramda/src/toUpper';
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
        const capitalize = converge(concat, [compose(toUpper, head), slice(1, Infinity)]);
        const eventNames = validateOnEvents.map(compose(partial(concat, ['on']), capitalize));
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
