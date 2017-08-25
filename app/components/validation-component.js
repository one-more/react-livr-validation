// @flow

import React, { Component } from 'react';
import ContextTypes from '../types/context-types';

export default function ValidationComponentHOC(WrapperComponent: any) {
    return class ValidationComponentWrapper extends Component {
        static contextTypes = ContextTypes;

        render() {
            return <WrapperComponent {...this.context} {...this.props} />;
        }
    };
}
