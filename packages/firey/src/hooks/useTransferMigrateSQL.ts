import {IFYORM} from "../types";
import {useConfig} from "./useConfig";
import OPERATE_TYPE from "../httpEnums/OPERATE_TYPE";

const _ = (val: any, text: string) => val ? text : ''

const transferForMysql = (model: IFYORM.Model, change: IFYORM.Change) => {
    let [sql, params] = ["", []]

    const optionsStr = (field: IFYORM.FieldOptions) => {
        const getDefaultValue = (defaultValue: any) => {
            if (field.type === 'Boolean') {
                return field.defaultValue ?? field.defaultValue ? 'TRUE' : 'FALSE'
            }
            if (['Int', 'Float', 'Decimal'].includes(field.type)) {
                return defaultValue
            }
            return `\'${defaultValue}\'`
        }
        return `${_(field.primaryKey, 'PRIMARY KEY')} ${_(field.nullable, 'NULL')} ${_(field.unique, 'UNIQUE')} ${_(field.default, `DEFAULT ${getDefaultValue(field.defaultValue)}`)} ${_(field.COMMENT, `COMMENT '${field.COMMENT}'`)}`
    }

    switch (change.type) {
        case OPERATE_TYPE.INIT:
            sql = `CREATE TABLE IF NOT EXISTS ${model.name} (`
            Object.keys(model.fields).forEach((fieldName, index) => {
                const field: IFYORM.FieldOptions = model.fields[fieldName]
                if (field.type === 'AutoIncrement') {
                    sql += `${fieldName} INT AUTO_INCREMENT }`
                } else {
                    sql += `${fieldName} ${field.type}${_(field.length, `(${field.length})`)}} ${optionsStr(field)}`
                }

                if (index < Object.keys(model.fields).length - 1) {
                    sql += ','
                }
            })
            break;
    }
}

const installFunc: Record<string, any> = {
    transferForMysql
}

const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const useTransferMigrateSQL = (model: IFYORM.Model, change: IFYORM.Change) => {
    const dbType = useConfig('database')[model.database || 'default'].type

    return Reflect.apply(installFunc[`transferFor${capitalizeFirstLetter(dbType)}`], null, [model, change])
}
