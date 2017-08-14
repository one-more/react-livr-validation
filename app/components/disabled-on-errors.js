// @flow

import React, { Component } from 'react';
import values from 'lodash/values';
import ContextTypes from '../types/context-types';

type Props = {
    children: any
};

export default class DisabledOnErrors extends Component {
    static contextTypes = ContextTypes;

    static defaultProps = {
        children: null
    };

    props: Props;

    render() {
        const { children } = this.props;
        const errors = this.context.getErrors();
        return React.cloneElement(children, {
            disabled: Boolean(values(errors).length)
        });
    }
}
