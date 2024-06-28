import {IFYORM} from "../types";

export class Relation {
    static OneToOne = (model: string, options?: IFYORM.OneToOneOptions) => ({
        type: 'OneToOne',
        model,
        ...options
    })
    static ForeignKey = (model: string, options?: IFYORM.ForeignKeyOptions) => ({
        type: 'ForeignKey',
        model,
        ...options
    })
    static ManyToMany = (model: string, options?: IFYORM.ManyToManyOptions) => ({
        type: 'ManyToMany',
        model,
        ...options
    })
}

export type RelationType = typeof Relation;