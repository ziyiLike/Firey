import {IFYORM} from "../types";
import {useConfig} from "./useConfig";
import OPERATE_TYPE from "../httpEnums/OPERATE_TYPE";

const indexSuffix = '_index'
const uniqueSuffix = '_unique'
const _ = (val: any, text: string) => val === undefined ? '' : val ? text : ''
const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

const transferForMysql = (model: IFYORM.Model, change: IFYORM.Change) => {
    let sql = ""

    const getDefaultValue = (field: IFYORM.FieldOptions) => {
        if (field.defaultValue === undefined) return ''
        if (field.type === 'Boolean') {
            return field.defaultValue ? ' DEFAULT TRUE' : ' DEFAULT FALSE'
        }
        if (['Int', 'BigInt', 'Float', 'Decimal'].includes(field.type)) {
            return ' DEFAULT ' + field.defaultValue
        }
        return ` DEFAULT \'${field.defaultValue}\'`
    }

    const optionsStr = (fieldName: string, field: IFYORM.FieldOptions) => {
        const createIndex = field.index ? `, INDEX ${fieldName + indexSuffix}(${fieldName})` : ''
        const createUnique = field.unique ? `, UNIQUE ${fieldName + uniqueSuffix}(${fieldName})` : ''

        return `${_(field.primaryKey, ' PRIMARY KEY')}${_(field.nullable, ' NULL')}${getDefaultValue(field)}${_(field.COMMENT, ` COMMENT '${field.COMMENT}'`)}` + createIndex + createUnique
    }

    const getFieldType = (fieldType: string) => {
        const fieldTypeMap: Record<string, string> = {
            String: 'VARCHAR',
            Int: 'INT',
            BigInt: 'BIGINT',
            Float: 'FLOAT',
            Decimal: 'DECIMAL',
            Date: 'DATE',
            DateTime: 'DATETIME',
            Time: 'TIME',
            Boolean: 'TINYINT',
            Json: 'JSON',
            Text: 'TEXT',
            AutoIncrement: 'INT PRIMARY KEY AUTO_INCREMENT'
        }
        return ' ' + fieldTypeMap[fieldType]
    }

    const getFieldOptions = (fieldName: string, field: IFYORM.FieldOptions) => {
        if (field.type === 'AutoIncrement') {
            return `${fieldName}${getFieldType(field.type)}${optionsStr(fieldName, field)}`
        } else if (['Date', 'DateTime', 'Time'].includes(field.type)) {
            return `${fieldName}${getFieldType(field.type)}${_(field.autoNowAdd, ` DEFAULT CURRENT_TIMESTAMP`)}${_(field.autoNow, ` DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)}${optionsStr(fieldName, field)}`
        } else if (['Int', 'BigInt', 'Float', 'Decimal'].includes(field.type)) {
            return `${fieldName}${getFieldType(field.type)}${_(field.type === 'Decimal', `(${field.precision},${field.scale})`)}${optionsStr(fieldName, field)}`
        } else {
            return `${fieldName}${getFieldType(field.type)}${_(field.length, `(${field.length})`)}${optionsStr(fieldName, field)}`
        }
    }

    switch (change.type) {
        case OPERATE_TYPE.INIT:
            sql = `CREATE TABLE IF NOT EXISTS ${model.name} (`
            Object.keys(model.fields).forEach((fieldName, index) => {
                const field: IFYORM.FieldOptions = model.fields[fieldName]
                sql += getFieldOptions(fieldName, field)
                index < Object.keys(model.fields).length - 1 && (sql += ',')
            })
            sql += `)`
            break;

        case OPERATE_TYPE.ADD:
            if (!change.key) throw new Error(`${model.name} key is required`)
            sql = `ALTER TABLE ${model.name} ADD COLUMN ${change.key} ${getFieldOptions(change.key, change.field)}`
            break;
        case OPERATE_TYPE.REMOVE:
            if (!change.key) throw new Error(`${model.name} key is required`)
            sql = `ALTER TABLE ${model.name} DROP COLUMN ${change.key}`
            break;
        case OPERATE_TYPE.ALERT:
            if (!change.key) throw new Error(`${model.name} key is required`)
            if (!change.field) throw new Error(`${model.name} field is required`)
            if (!change.oldField) throw new Error(`${model.name} oldField is required`)
            if (change.field.type !== change.oldField.type) {
                if (change.field.type !== 'Decimal') {
                    sql += `ALTER TABLE ${model.name} MODIFY COLUMN ${change.key}${getFieldType(change.field.type)}${_(change.field.length, `(${change.field.length})`)};`
                } else {
                    sql += `ALTER TABLE ${model.name} MODIFY COLUMN ${change.key} DECIMAL(${change.field.precision},${change.field.scale});`
                }
            }
            if (change.field.nullable !== change.oldField.nullable) {
                sql += `ALTER TABLE ${model.name} MODIFY COLUMN ${change.key} ${change.field.nullable ? 'NULL':'NOT NULL'};`
            }
            if (change.field.unique !== change.oldField.unique) {
                sql += `ALTER TABLE ${model.name} ${change.field.unique ? 'ADD UNIQUE INDEX' : 'DROP INDEX'} ${change.key + uniqueSuffix}${_(change.field.unique , `(${change.key})`)};`
            }
            if (change.field.index !== change.oldField.index) {
                sql += `ALTER TABLE ${model.name} ${change.field.index ? 'ADD INDEX' : 'DROP INDEX'} ${change.key + indexSuffix}${_(change.field.index , `(${change.key})`)};`
            }
            if (change.field.defaultValue !== change.oldField.defaultValue) {
                sql += `ALTER TABLE ${model.name} AlTER COLUMN ${change.key} ${change.field.defaultValue === undefined ? 'DROP DEFAULT' : 'SET' + getDefaultValue(change.field)};`
            }
            if (change.field.comment !== change.oldField.comment) {
                sql += `ALTER TABLE ${model.name} MODIFY COLUMN ${change.key} COMMENT '${change.field.comment}'`
            }
            if (change.field.autoNowAdd !== change.oldField.autoNowAdd) {
                sql += `ALTER TABLE ${model.name} AlTER COLUMN ${change.key} ${change.field.autoNowAdd ? 'SET DEFAULT CURRENT_TIMESTAMP' : 'DROP DEFAULT'};`
            }
            if (change.field.autoNow !== change.oldField.autoNow) {
                sql += `ALTER TABLE ${model.name} AlTER COLUMN ${change.key} ${change.field.autoNow ? 'SET DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' : 'DROP DEFAULT'};`
            }
            if (change.field.primaryKey !== change.oldField.primaryKey) {
                sql += `ALTER TABLE ${model.name} ${change.field.primaryKey ? 'ADD PRIMARY KEY' : 'DROP PRIMARY KEY'} (${change.key});`
            }
            break
        case OPERATE_TYPE.RENAME:
            if (!change.key) throw new Error(`${model.name} key is required`)
            if (model.fields[change.key].type !== 'Decimal') {
                sql = `ALTER TABLE ${model.name} CHANGE COLUMN ${change.oldKey} ${change.key}${getFieldType(model.fields[change.key].type)}${_(model.fields[change.key].length, `(${model.fields[change.key].length})`)};`
            } else {
                sql = `ALTER TABLE ${model.name} CHANGE COLUMN ${change.oldKey} ${change.key} DECIMAL(${model.fields[change.key].precision},${model.fields[change.key].scale});`
            }
            break
        case OPERATE_TYPE.TABLENAME:
            sql = `ALTER TABLE ${change.oldName} RENAME TO ${change.name}`
            break
    }

    return sql
}

const installFunc: Record<string, any> = {
    transferForMysql
}

export const useTransferMigrateSQL = (model: IFYORM.Model, change: IFYORM.Change): string => {
    const dbType = useConfig('database')[model.database || 'default'].type
    if (!dbType) throw new Error('Database type is undefined! Please set database type in defineConfig database.')

    return Reflect.apply(installFunc[`transferFor${capitalizeFirstLetter(dbType)}`], null, [model, change])
}
