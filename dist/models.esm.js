// 定义data descriptor
function defVal(target, key, val, enumerable, configurable, writable) {
    if (enumerable === void 0) { enumerable = true; }
    if (configurable === void 0) { configurable = true; }
    if (writable === void 0) { writable = true; }
    Object.defineProperty(target, key, {
        value: val,
        configurable: configurable,
        enumerable: enumerable,
        writable: writable
    });
}
// 强制转化成type
function typeCast(value, type) {
    window[type](value);
}

/**
 * 解析类型信息
 *
 * @param {TypeInfo} info 类型信息
 */
function _parseTypeInfo(info) {
    return {
        type: info.type.indexOf('?') !== -1 ? info.type.slice(0, -1) : info.type,
        nullable: info.type.indexOf('?') !== -1,
        "default": info["default"]
    };
}
function camelCase(key) {
    return key.replace(/[-_][a-z0-9]/g, function (ch) { return ch.substr(1).toUpperCase(); });
}
function snakeCase(key) {
    return key.replace(/[A-Z0-9]+/g, function (ch) { return ('_' + ch.toLowerCase()); });
}
/**
 * 是否是null或者undefined
 *
 * @param {} v 参数
 *
 * @return {boolean}
 */
function isUndef(v) {
    return v === null || v === undefined;
}

var Schema = /** @class */ (function () {
    function Schema(model, data) {
        defVal(this, '_name', 'Schema', false, false, true);
        defVal(this, '_models', {}, false, false, true);
        defVal(this, '_data', {}, false, false, true);
        defVal(this, '_typeInfo', {}, false, false, true);
        defVal(this, '_camelKeys', [], false, false, true);
        defVal(this, '_snakeKeys', [], false, false, true);
        var keys = Object.keys(model);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            this.registerProperty(key, model[key]);
        }
        if (data) {
            var keys_1 = Object.keys(data);
            for (var i_1 = 0, len_1 = keys_1.length; i_1 < len_1; i_1++) {
                this[key] = data[key];
            }
        }
    }
    /**
     * 注册数据
     * @param {string} key 要求camel形式
     */
    Schema.prototype.registerProperty = function (key, typeInfo) {
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
            var defaultValue = typeInfo["default"] instanceof Function ? typeInfo["default"]() : typeInfo["default"];
            return isUndef(ret) && !isUndef(defaultValue) ? defaultValue : ret;
        }
        // setter
        function setter(value) {
            var typeInfo = self._typeInfo[key];
            if (isUndef(value)) {
                // 检查是否有默认值
                var defaultValue = typeInfo["default"];
                if (!isUndef(defaultValue)) {
                    value = defaultValue instanceof Function ? defaultValue() : defaultValue;
                }
                if (isUndef(value) && !typeInfo.nullable) {
                    throw new Error("key " + key + " in " + self._name + " is not nullable");
                }
            }
            else {
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
            set: setter
        });
        Object.defineProperty(this, snakeCase(key), {
            enumerable: false,
            configurable: true,
            get: getter,
            set: setter
        });
        this._snakeKeys.push(snakeCase(key));
        this._camelKeys.push(camelCase(key));
    };
    /**
     * 批量设置
     */
    Schema.prototype.inflate = function (obj) {
        var keys = Object.keys(obj);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            this[key] = obj[key];
        }
    };
    /**
     * 获得snake_style数据
     */
    Schema.prototype.getSnake = function () {
        var result = {};
        for (var i = 0, len = this._snakeKeys.length; i < len; i++) {
            var key = this._snakeKeys[i];
            result[key] = this[key];
        }
        return result;
    };
    /**
     * 获得camel_style数据
     */
    Schema.prototype.getCamel = function () {
        var result = {};
        for (var i = 0, len = this._camelKeys.length; i < len; i++) {
            var key = this._camelKeys[i];
            result[key] = this[key];
        }
        return result;
    };
    return Schema;
}());

export default Schema;
