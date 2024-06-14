/*
use like this:

export const UserModel = defineModel({
    name: 'users',
    fields: {
        id: Field.AutoIncrement(),
        name: Field.String(20, {unique: true}),
        email: Field.String({nullable: false, index: true}),
        password: Field.String(20),
        createdAt: Field.Date({autoNowAdd: true}),
        updatedAt: Field.Date({autoNow: true}),
        deletedAt: Field.Date()
    },
    relations: {
        posts: Relation.ForeignKey(PostModel),
        comments: Relation.ManyToMany(CommentModel)
    }
})
 */


export const defineModel = (model: any) => model