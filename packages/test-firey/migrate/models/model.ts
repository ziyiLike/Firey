import {defineModel} from "firey/hooks-test";
import {Field} from "firey/orm-test"

export const UserModel = defineModel({
    name: 'users',
    fields: {
        id: Field.AutoIncrement(),
        name: Field.String(30, {unique: true}),
        sex: Field.Boolean({defaultValue: true}),
        email: Field.String(255, {nullable: false, index: true}),
        password1: Field.String(20),
        createdAt: Field.DateTime({autoNowAdd: true}),
        updatedAt: Field.DateTime({autoNow: true}),
        deletedAt: Field.Date()
    },
})
export const RoleModel = defineModel({})
export const MenuModel = defineModel({})