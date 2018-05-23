export * from './lang';

/**
 * 解析类型信息
 * 
 * @param {TypeInfo} info 类型信息
 */
export function _parseTypeInfo(info: TypeInfo): object {
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