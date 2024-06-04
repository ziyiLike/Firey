import {FileData} from "../dataclasses/FileData";

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

export const tagLog = (message: string, tag: string = '[Firefly]') => {
    console.log(`${tag} ${message}`);
}

export const isIn = (value: any, arr: any[]) => {
    return arr.includes(value);
}

export const parseFormData = (contentType: string, chunksData: string) => {
    const boundary = contentType.split('boundary=')[1];
    // Remove the last boundary
    chunksData = chunksData.replace(`--${boundary}--\r\n`, '');
    // Split the data into parts
    const parts = chunksData.split(`--${boundary}\r\n`).filter(part => part.trim() !== '');

    let result = {} as Record<string, string | undefined | FileData>;

    parts.map(part => {
        let matchResult = part.match(/Content-Disposition:.*;\s+name="([^"]+)"(?:;\s*filename="([^"]*)")?/);
        if (matchResult) {
            const key = matchResult[1];
            const name = matchResult[2];
            const content = part.slice(matchResult.index! + matchResult[0].length).trim().split('\r\n').pop();

            result[key] = name ? new FileData({key, name, content}) : content
        }
    })

    return result;
}

export const zip = (keys: string[], values: any[]): Record<string, any> => {
    if (keys.length !== values.length) {
        throw new Error("keys和values数组长度不一致，无法映射为对象");
    }

    const result: Record<string, any> = {};
    for (let i = 0; i < keys.length; i++) {
        result[keys[i]] = values[i];
    }

    return result;
}