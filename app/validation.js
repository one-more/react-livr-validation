// @flow

import {Component} from 'react'
import LIVR from 'livr'
import pick from 'lodash/pick'
import omit from 'lodash/omit'
import assign from 'lodash/assign'
import keys from 'lodash/keys'
import equals from 'ramda/src/equals'
import isEmpty from 'ramda/src/isEmpty'
import partialRight from 'ramda/src/partialRight'
import when from 'ramda/src/when'
import pipe from 'ramda/src/pipe'
import ContextTypes from './types/context-types'

const HAS_ERRORS = 'HAS_ERRORS';

type AliasedRule = {
    name: string,
    rules: Object,
    error: string
};

type Props = {
    data: Object,
    schema: Object,
    rules?: Object,
    aliasedRules?: Array<AliasedRule>,
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
        errorCodes: {}
    };

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

            getErrors: () => this.state.errors,

            className: this.props.className,

            style: this.props.style,

            errorCodes: this.props.errorCodes
        };
    }

    componentDidMount() {
        const {schema} = this.props;
        this.createValidator(schema);
        this.initialValidate();
    }

    componentWillReceiveProps({schema: nextSchema, data: nextData}: Props) {
        const {schema, data} = this.props;
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
        const {rules, aliasedRules} = this.props;
        this.validator = new LIVR.Validator(schema);
        this.validator.registerRules(rules);
        aliasedRules.forEach((rule: AliasedRule) => {
            this.validator.registerAliasedRule(rule)
        })
    }

    validateData(data: Object, name: string) {
        const {errors: stateErrors} = this.state;
        const {validator} = this;
        validator.validate(data);
        const errors = validator.getErrors();
        const error = pick(errors, name);

        const partialOmit = fields => partialRight(omit, [fields]);
        const partialAssign = obj => partialRight(assign, [obj]);
        const getNextErrors = pipe(
            when(
                () => !isEmpty(error),
                partialAssign(error)
            ),
            when(
                () => stateErrors[name] && isEmpty(error),
                partialOmit(name)
            ),
            when(
                () => stateErrors[HAS_ERRORS] && !errors,
                partialOmit(HAS_ERRORS)
            ),
            when(
                () => !stateErrors[HAS_ERRORS] && errors,
                partialAssign({HAS_ERRORS: 1})
            )
        );

        this.setState({
            errors: {
                ...getNextErrors(stateErrors)
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