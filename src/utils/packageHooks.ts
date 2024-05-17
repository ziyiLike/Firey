export const isPrototype = (childInstance: any, parentClass: any) => {
    return childInstance instanceof parentClass;
}

export const splitQuery = (path: string) => {
    const queryObj = {} as any;
    const queryStr = path.split('?')[1];
    if (queryStr) {
        const queryArr = queryStr.split('&');
        queryArr.forEach((item: string) => {
            const [key, value] = item.split('=');
            queryObj[key] = value;
        })
    }
    return queryObj;
}

export const tagLog = (message: string, tag: string = '【Firefly】') => {
    console.log(`${tag}   ${message}`);
}