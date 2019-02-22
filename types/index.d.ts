export class Schema {
    // schema名称
    _name: string;
    // 模型原型
    _models: Model;
    // 类型信息
    _metaInfo: {
        [key: string]: ParsedTypeInfo,
    };
    // 数据存储
    _data: {
        [key: string]: any,
    };
    // camel
    _camelKeys: [string];
    // snake
    _snakeKeys: [string];

    constructor(models: Model, data?: object, options?: ModelOptions);
    registerProperty(key: string, typeInfo: TypeInfo): void;
    inflate(obj: object): void;
    getSnake(): object;
    getCamel(): object;
    equal(to: object): boolean;
    setNullable(key: string, nullable: boolean): void;
}

export interface Model {
    [propName: string]: TypeInfo;
}

export interface TypeInfo {
    type: string;
    default?: any;
    extra?: any;
}

export interface ParsedTypeInfo {
    type: string; // 不会包含?这样的字符
    nullable: boolean;
    default: any;
    extra: any;
}

export interface ModelOptions {
    metaInfoConfigurable: boolean;
}

export interface RuntimeOptions {
    models: Model;
}