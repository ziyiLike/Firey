import {IFYORM} from "../types";

export class Field {
    static AutoIncrement = (options?: IFYORM.FieldOptions) => ({type: 'AutoIncrement', ...options})
    static String = (length?: number, options?: IFYORM.StringFieldOptions) => ({type: 'String', length, ...options})
    static Text = (options?: IFYORM.TextFieldOptions) => ({type: 'Text', ...options})
    static Int = (options?: IFYORM.NumberFieldOptions) => ({type: 'Int', ...options})
    static BigInt = (options?: IFYORM.NumberFieldOptions) => ({type: 'BigInt', ...options})
    static Float = (options?: IFYORM.NumberFieldOptions) => ({type: 'Float', ...options})
    static Decimal = (options?: IFYORM.NumberFieldOptions) => ({type: 'Decimal', ...options})
    static Boolean = (options?: IFYORM.BooleanFieldOptions) => ({type: 'Boolean', ...options})
    static Date = (options?: IFYORM.DateFieldOptions) => ({type: 'Date', ...options})
    static Time = (options?: IFYORM.DateFieldOptions) => ({type: 'Time', ...options})
    static DateTime = (options?: IFYORM.DateFieldOptions) => ({type: 'DateTime', ...options})
    static Json = (options?: IFYORM.JsonFieldOptions) => ({type: 'Json', ...options})
}

export type FieldType = typeof Field;