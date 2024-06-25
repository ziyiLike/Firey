export namespace IFYORM {
    type FieldOptions<T = any> = {
        defaultValue?: any
        nullable?: boolean
        unique?: boolean
        index?: boolean
        primaryKey?: boolean
        comment?: string
    } & T

    type StringFieldOptions = FieldOptions<{}>
    type TextFieldOptions = FieldOptions<{}>
    type NumberFieldOptions = FieldOptions<{
        min?: number
        max?: number
    }>
    type DecimalFieldOptions = FieldOptions<{
        precision?: number
        scale?: number
    }>
    type BooleanFieldOptions = FieldOptions<{}>
    type DateFieldOptions = FieldOptions<{
        autoNow?: boolean
        autoNowAdd?: boolean
    }>
    type JsonFieldOptions = FieldOptions<{}>
}