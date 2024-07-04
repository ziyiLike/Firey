import {IFY} from "./firey";
import OPERATE_TYPE from "../httpEnums/OPERATE_TYPE";

export namespace IFYORM {
    interface Model {
        name: string,
        database?: keyof IFY.ConfigDatabase,
        fields?: Record<string, FieldOptions>,
        relations?: Record<string, RelationOptions>,
    }

    interface Change {
        type: OPERATE_TYPE,
        model: Model,
        key?: string
        field?: Record<string, FieldOptions>
        oldField?: Record<string, FieldOptions>
        name?: string
        oldName?: string
        oldKey?: string
        isMigrate?: boolean
    }

    // Customer Field Options
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

    // Relation Options
    type RelationOptions<T = any> = {
        related?: string
        nullable?: boolean
        comment?: string
    } & T
    type OneToOneOptions = RelationOptions<{
        onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION'
    }>
    type ForeignKeyOptions = RelationOptions<{
        onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION'
    }>
    type ManyToManyOptions = RelationOptions<{
        through?: string
    }>
}