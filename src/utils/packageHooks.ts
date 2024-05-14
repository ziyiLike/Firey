export const isPrototype = (childInstance: any, parentClass: any) => {
    return childInstance instanceof parentClass;
}