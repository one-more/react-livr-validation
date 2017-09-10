// @flow

import React, { Component } from 'react';
import values from 'ramda/src/values';
import HOC from './validation-component';

type Props = {
    children: any,
    getErrors: Function
};

class DisabledOnErrors extends Component {
    static defaultProps = {
        children: null
    };

    props: Props;

    render() {
        const { children, getErrors } = this.props;
        const errors = getErrors();
        return React.cloneElement(children, {
            disabled: Boolean(values(errors).length)
        });
    }
}
export default HOC(DisabledOnErrors);
