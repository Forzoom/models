
import {
    defVal,
    camelCase,
    snakeCase,
    isUndef,
    typeCast,
    arrayEqual,
    parseTypeInfo,
    isFunction,
} from './utils/index';

class Schema {
    static utils: object;
    // schema名称
    _name: string;
    // 模型原型
    _models: Model;
    // 类型信息
    _metaInfo: object;
    // 数据存储
    _data: object;
    // camel
    _camelKeys: [string];
    // snake
    _snakeKeys: [string];
    // 允许添加其他属性
    [propName: string]: any;

    constructor(model: Model, data?: object) {
        defVal(this, '_name', 'Schema', false, false, true);
        defVal(this, '_models', {}, false, false, true);
        defVal(this, '_data', {}, false, false, true);
        defVal(this, '_metaInfo', {}, false, false, true);
        defVal(this, '_camelKeys', [], false, false, true);
        defVal(this, '_snakeKeys', [], false, false, true);

        const keys = Object.keys(model);
        var typeInfo = {};
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            this.registerProperty(key, model[key]);
        }

        if (data) {
            const keys = Object.keys(data);
            for (let i = 0, len = keys.length; i < len; i++) {
                const key = keys[i];
                this[key] = data[key];
            }
        }
    }

    /**
     * 注册数据
     * @param {string} key 要求camel形式
     */
    registerProperty(key: string, typeInfo: TypeInfo) {
        if (key[0] === '_') {
            return;
        }
        var self = this;
        this._models[key] = typeInfo;
        this._metaInfo[key] = parseTypeInfo(typeInfo);

        // getter
        function getter() {
            var metaInfo = self._metaInfo[key];
            var ret = !isUndef(self._data[key]) ? self._data[key] : null;
            var defaultValue = metaInfo.default instanceof Function ? metaInfo.default() : metaInfo.default;
            if (isUndef(ret) && !isUndef(defaultValue)) {
                // 记录数据
                this._data[key] = defaultValue;
            }
            return !isUndef(self._data[key]) ? self._data[key] : null;
        }

        // setter
        function setter(value) {
            var metaInfo = self._metaInfo[key];
            if (isUndef(value)) {
                // 检查是否有默认值
                var defaultValue = metaInfo.default;
                if (!isUndef(defaultValue)) {
                    value = defaultValue instanceof Function ? defaultValue() : defaultValue;
                }
                if (isUndef(value) && !metaInfo.nullable) {
                    throw new Error(`key ${key} in ${self._name} is not nullable`);
                }
            } else {
                // 尝试类型转换
                var valueType = Object.prototype.toString.call(value).slice(8, -1);
                if (metaInfo.type.indexOf(valueType) === -1) {
                    value = typeCast(value, metaInfo.type);
                }
            }

            this._data[key] = value;

            // hook
            if (metaInfo.didSet && isFunction(metaInfo.didSet)) {

            }
        }

        // 必须先定义snake，再定义camel，因为部分情况下 snakeCase(key) == camelCase(key)
        Object.defineProperty(this, snakeCase(key), {
            enumerable: false,
            configurable: true,
            get: getter,
            set: setter,
        });
        Object.defineProperty(this, camelCase(key), {
            enumerable: true,
            configurable: true,
            get: getter,
            set: setter,
        });

        this._snakeKeys.push(snakeCase(key));
        this._camelKeys.push(camelCase(key));
    }

    /**
     * 批量设置
     */
    inflate(obj: object): void {
        var keys = Object.keys(obj);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            this[key] = obj[key];
        }
    }

    /**
     * 获得snake_style数据
     */
    getSnake(): object {
        var result = {};
        for (var i = 0, len = this._snakeKeys.length; i < len; i++) {
            var key = this._snakeKeys[i];
            result[key] = this[key];
        }
        return result;
    }

    /**
     * 获得camel_style数据
     */
    getCamel(): object {
        var result = {};
        for (var i = 0, len = this._camelKeys.length; i < len; i++) {
            var key = this._camelKeys[i];
            result[key] = this[key];
        }
        return result;
    }

    equal(to: object): boolean {
        for (let i = 0, len = this._camelKeys.length; i < len; i++) {
            const key = this._camelKeys[i];
            const type = (this._metaInfo[key] as TypeInfo).type;
            if (type == 'Array') {
                if (!arrayEqual(this[key], to[key])) {
                    return false;
                }
            } else {
                if (this[key] !== to[key]) {
                    return false;
                }
            }
        }
        return true;
    }
}

Schema.utils = {
    arrayEqual,
};

export default Schema;