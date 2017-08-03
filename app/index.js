// @flow

import {Component} from 'react';
import LIVR from 'livr';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import values from 'lodash/values';
import keys from 'lodash/keys';
import ContextTypes from './types/context-types';

const HAS_ERRORS = 'HAS_ERRORS';

type Props = {
    data: Object,
    schema: Object,
    children?: any
};

type State = {
    errors: Object
};

type DataChunk = {
    name: string,
    value: any
};

LIVR.Validator.defaultAutoTrim(true);

export default class Validation extends Component {
    static childContextTypes = ContextTypes;

    state: State = {
        errors: {}
    };

    getChildContext() {
        return {
            setData: ({name, value}: DataChunk) => {
                const {data} = this;
                data[name] = value;
                this.validateData(data, name);
            },

            getError: (name: string) => this.state.errors[name],

            getErrors: () => this.state.errors
        };
    }

    componentDidMount() {
        this.validator = new LIVR.Validator(this.props.schema);
        this.initialValidate();
    }

    validateData(data: Object, name: string) {
        const {errors: stateErrors} = this.state;
        const {validator} = this;
        validator.validate(data);
        const errors = validator.getErrors();
        const error = pick(errors, name);
        let nextErrors;

        if (values(error).length) {
            nextErrors = {
                ...stateErrors,
                ...error
            };
        } else if (stateErrors[name]) {
            nextErrors = {
                ...omit(
                    stateErrors,
                    [name]
                )
            };
        }
        if (stateErrors[HAS_ERRORS] && !errors) {
            nextErrors = {
                ...omit(
                    nextErrors,
                    [HAS_ERRORS]
                )
            };
        }
        this.setState({
            errors: {
                ...nextErrors
            }
        });
    }

    initialValidate() {
        const {validator} = this;
        const {data, schema} = this.props;
        const validationData = keys(schema).reduce((acc: Object, key: string) => {
            acc[key] = data[key];
            return acc;
        }, {});
        validator.validate(validationData);
        const errors = validator.getErrors();
        if (errors) {
            this.setState({
                errors: {
                    [HAS_ERRORS]: 1
                }
            });
        }
    }

    validator: Object;

    props: Props;

    data = this.props.data;

    render() {
        return this.props.children;
    }
}

export {default as ValidationInput} from './components/validation-input';
export {default as DisabledOnErrors} from './components/disabled-on-errors';
