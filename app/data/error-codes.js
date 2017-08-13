const NOT_EMPTY = 'поле не может быть пустым';
const WRONG_FORMAT = 'неверный формат данных';
const POSITIVE_NUMBER = 'число должно быть больше 0';
const POSITIVE_NUMBER_EN = 'number should be positive';

export default {
    CANNOT_BE_EMPTY: 'field cannot be empty',
    REQUIRED: 'field is required',
    FORMAT_ERROR: 'field format error',
    NOT_ALLOWED_VALUE: 'value is not allowed',
    TOO_LONG: 'too long value',
    TOO_SHORT: 'too short value',
    WRONG_FORMAT: 'wrong field format',
    NOT_INTEGER: 'field should be integer',
    NOT_POSITIVE_INTEGER: POSITIVE_NUMBER_EN,
    NOT_DECIMAL: 'field should be decimal',
    NOT_POSITIVE_DECIMAL: POSITIVE_NUMBER_EN,
    TOO_HIGH: 'number is too high',
    NOT_NUMBER: 'field should be a number',
    TOO_LOW: 'number is too low',
    WRONG_EMAIL: 'wrong email format',
    WRONG_URL: 'wrong url format',
    WRONG_DATE: 'wrong date format',
    FIELDS_NOT_EQUAL: 'fields are not equal'
};

export const RU = {
    CANNOT_BE_EMPTY: NOT_EMPTY,
    REQUIRED: NOT_EMPTY,
    FORMAT_ERROR: WRONG_FORMAT,
    NOT_ALLOWED_VALUE: 'недопустимое значение',
    TOO_LONG: 'значение слишком длинное',
    TOO_SHORT: 'значение слишком короткое',
    WRONG_FORMAT,
    NOT_INTEGER: 'значение должно быть числом',
    NOT_POSITIVE_INTEGER: POSITIVE_NUMBER,
    NOT_DECIMAL: 'значение должно быть числом с запятой',
    NOT_POSITIVE_DECIMAL: POSITIVE_NUMBER,
    TOO_HIGH: 'слишком большое число',
    NOT_NUMBER: 'значение должно быть числом',
    TOO_LOW: 'число слишком маленькое',
    WRONG_EMAIL: 'неверный формат email',
    WRONG_URL: 'неверный формат url',
    WRONG_DATE: 'неверный формат даты',
    FIELDS_NOT_EQUAL: 'поля должны быть идентичны'
};
