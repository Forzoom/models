
import {
    defVal,
    camelCase,
    snakeCase,
    isUndef,
    typeCast,
    _parseTypeInfo,
} from './utils/index';

class Schema {
    // schema名称
    _name: string;
    // 模型原型
    _models: Model;
    // 类型信息
    _typeInfo: object;
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
        defVal(this, '_typeInfo', {}, false, false, true);
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
            keys.forEach(function(key) {
                this[key] = data[key];
            });
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
        this._typeInfo[key] = _parseTypeInfo(typeInfo);

        // getter
        function getter() {
            var typeInfo = self._typeInfo[key];
            var ret = self._data[key] || null;
            var defaultValue = typeInfo.default instanceof Function ? typeInfo.default() : typeInfo.default;
            return isUndef(ret) && !isUndef(defaultValue) ? defaultValue : ret;
        }

        // setter
        function setter(value) {
            var typeInfo = self._typeInfo[key];
            if (isUndef(value)) {
                // 检查是否有默认值
                var defaultValue = typeInfo.default;
                if (!isUndef(defaultValue)) {
                    value = defaultValue instanceof Function ? defaultValue() : defaultValue;
                }
                if (isUndef(value) && !typeInfo.nullable) {
                    throw new Error(`key ${key} in ${self._name} is not nullable`);
                }
            } else {
                // 尝试类型转换
                var valueType = Object.prototype.toString.call(value).slice(8, -1);
                if (typeInfo.type.indexOf(valueType) === -1) {
                    typeCast(value, typeInfo.type);
                }
            }

            this._data[key] = value;
        }

        Object.defineProperty(this, camelCase(key), {
            enumerable: true,
            configurable: true,
            get: getter,
            set: setter,
        });
        Object.defineProperty(this, snakeCase(key), {
            enumerable: false,
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
}

export default Schema;