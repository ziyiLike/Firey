export const useDeepClone = <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') {
        return obj as T;
    }
    const clone: T = Array.isArray(obj) ? ([] as unknown as T) : ({} as T);
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clone[key] = useDeepClone(obj[key]);
        }
    }
    return clone;
};