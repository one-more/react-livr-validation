// @flow

import { Component } from 'react';
import LIVR from 'livr';
import pick from 'ramda/src/pick';
import omit from 'ramda/src/omit';
import merge from 'ramda/src/merge';
import __ from 'ramda/src/__';
import keys from 'ramda/src/keys';
import compose from 'ramda/src/compose';
import prop from 'ramda/src/prop';
import and from 'ramda/src/and';
import not from 'ramda/src/not';
import equals from 'ramda/src/equals';
import isEmpty from 'ramda/src/isEmpty';
import when from 'ramda/src/when';
import pipe from 'ramda/src/pipe';
import ContextTypes from './types/context-types';

const HAS_ERRORS = 'HAS_ERRORS';

type AliasedRule = {
    name: string,
    rules: Object,
    error: string
};

type Props = {
    data: Object,
    schema: Object,
    rules: Object,
    aliasedRules: Array<AliasedRule>,
    className: string,
    style: Object,
    errorCodes: Object,
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

    static defaultProps = {
        rules: {},
        aliasedRules: [],
        className: '',
        style: {},
        errorCodes: {},
        data: {},
        schema: {}
    };

    state: State = {
        errors: {}
    };

    getChildContext() {
        return {
            setData: ({ name, value }: DataChunk) => {
                const { data } = this;
                data[name] = value;
                this.validateData(data, name);
            },

            getError: (name: string) => this.state.errors[name],

            getErrors: () => this.state.errors,

            className: this.props.className,

            style: this.props.style,

            errorCodes: this.props.errorCodes
        };
    }

    componentDidMount() {
        const { schema } = this.props;
        this.createValidator(schema);
        this.initialValidate();
    }

    componentWillReceiveProps({ schema: nextSchema, data: nextData }: Props) {
        const { schema, data } = this.props;
        const equalsSchema = equals(schema, nextSchema);
        const equalsData = equals(data, nextData);
        if (!equalsSchema) {
            this.createValidator(nextSchema);
        }
        if (!equalsData) {
            this.data = nextData;
        }
        if (!equalsSchema || !equalsData) {
            this.validateData(this.data, '');
        }
    }

    createValidator(schema: Object) {
        const { rules, aliasedRules } = this.props;
        this.validator = new LIVR.Validator(schema);
        this.validator.registerRules(rules);
        aliasedRules.forEach((rule: AliasedRule) => {
            this.validator.registerAliasedRule(rule);
        });
    }

    getNextErrors = (name: string, error: Object, errors: Object) => {
        const { errors: stateErrors } = this.state;
        const nextErrorsPipe = pipe(
            when(() => !isEmpty(error), merge(__, error)),
            when(compose(and(isEmpty(error)), prop(name)), omit([name])),
            when(compose(and(!errors), prop(HAS_ERRORS)), omit([HAS_ERRORS])),
            when(
                compose(and(errors), not, prop(HAS_ERRORS)),
                merge(__, { [HAS_ERRORS]: 1 })
            )
        );
        return nextErrorsPipe(stateErrors);
    };

    validateData(data: Object, name: string) {
        const { validator, getNextErrors } = this;
        validator.validate(data);
        const errors = validator.getErrors();
        const error = pick([name], errors || {});

        this.setState({
            errors: {
                ...getNextErrors(name, error, errors)
            }
        });
    }

    initialValidate() {
        const { validator } = this;
        const { data, schema } = this.props;
        const validationData = keys(
            schema
        ).reduce((acc: Object, key: string) => {
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
