import {defineModel} from "firey/hooks-test";
import {Field} from "firey/orm-test"

export const UserModel = defineModel({
    name: 'users_test',
    fields: {
        id: Field.AutoIncrement(),
        name: Field.String(30, {unique: true}),
        sex: Field.Boolean({defaultValue: false}),
        email: Field.String(255, {nullable: false, index: true}),
        password1: Field.String(20),
        createdAt: Field.DateTime({autoNowAdd: true}),
        updatedAt: Field.DateTime({autoNow: true}),
    },
})

export const TestModel = defineModel({
    name: 'test',
    fields: {
        id: Field.AutoIncrement(),
        name: Field.String(30, {unique: true}),
    }
})