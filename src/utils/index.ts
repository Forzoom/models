export * from './lang';

/**
 * 解析类型信息
 * 
 * @param {TypeInfo} info 类型信息
 */
export function parseTypeInfo(info: TypeInfo): object {
    return {
        type: info.type.indexOf('?') !== -1 ? info.type.slice(0, -1) : info.type, // 不会包含?这样的字符
        nullable: info.type.indexOf('?') !== -1,
        default: info.default,
    };
}

export function camelCase(key: string): string {
    return key.replace(/[-_][a-z0-9]/g, ch => ch.substr(1).toUpperCase());
}

export function snakeCase(key: string): string {
    return key.replace(/[A-Z0-9]+/g, ch => ('_' + ch.toLowerCase()));
}

/**
 * 是否是null或者undefined
 *
 * @param {} v 参数
 *
 * @return {boolean}
 */
export function isUndef(v) {
    return v === null || v === undefined;
}

/**
 * 判断数组相等
 * @param arr1 
 * @param arr2 
 */
export function arrayEqual(arr1: Array<any>, arr2: Array<any>) {
    if (arr1.length != arr2.length) {
        return false;
    }
    const map = {};
    for (let i = 0, len = arr1.length; i < len; i++) {
        const key = arr1[i];
        map[key] = 0;
    }
    for (let i = 0, len = arr1.length; i < len; i++) {
        const key = arr2[i];
        map[key] = 1;
    }
    return arr1.filter(key => map[key] == 0).length == 0;
}

export function isType(name): (any) => boolean {
    return function(obj: any): boolean {
        return Object.prototype.toString.call(obj) === '[object ' + name + ']';
    };
}

export const isFunction = isType('Function');