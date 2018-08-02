'use strict';

// 定义data descriptor
function defVal(target, key, val, configurable, enumerable, writable) {
    if (configurable === void 0) { configurable = true; }
    if (enumerable === void 0) { enumerable = true; }
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
    return window[type](value);
}

/**
 * 解析类型信息
 *
 * @param {TypeInfo} info 类型信息
 */
function parseTypeInfo(info) {
    return {
        type: info.type.indexOf('?') !== -1 ? info.type.slice(0, -1) : info.type,
        nullable: info.type.indexOf('?') !== -1,
        "default": info["default"],
        extra: info.extra
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
/**
 * 判断数组相等
 * @param arr1
 * @param arr2
 */
function arrayEqual(arr1, arr2) {
    if (arr1.length != arr2.length) {
        return false;
    }
    var map = {};
    for (var i = 0, len = arr1.length; i < len; i++) {
        var key = arr1[i];
        map[key] = 0;
    }
    for (var i = 0, len = arr1.length; i < len; i++) {
        var key = arr2[i];
        map[key] = 1;
    }
    return arr1.filter(function (key) { return map[key] == 0; }).length == 0;
}
function isType(name) {
    return function (obj) {
        return Object.prototype.toString.call(obj) === '[object ' + name + ']';
    };
}
var isFunction = isType('Function');

var Schema = /** @class */ (function () {
    function Schema(model, data, options) {
        options = Object.assign({
            metaInfoConfigurable: false
        }, options || {});
        defVal(this, '_name', 'Schema', false, false, true);
        defVal(this, '_models', {}, false, false, true);
        defVal(this, '_data', {}, false, false, true);
        defVal(this, '_metaInfo', {}, options.metaInfoConfigurable, false, true);
        defVal(this, '_camelKeys', [], false, false, true);
        defVal(this, '_snakeKeys', [], false, false, true);
        var keys = Object.keys(model);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            this.registerProperty(key, model[key]);
        }
        if (data) {
            this.inflate(data);
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
        this._metaInfo[key] = parseTypeInfo(typeInfo);
        // getter
        function getter() {
            var metaInfo = self._metaInfo[key];
            var ret = !isUndef(self._data[key]) ? self._data[key] : null;
            var defaultValue = metaInfo["default"] instanceof Function ? metaInfo["default"]() : metaInfo["default"];
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
                var defaultValue = metaInfo["default"];
                if (!isUndef(defaultValue)) {
                    value = defaultValue instanceof Function ? defaultValue() : defaultValue;
                }
                if (isUndef(value) && !metaInfo.nullable) {
                    throw new Error("key " + key + " in " + self._name + " is not nullable");
                }
            }
            else {
                // 尝试类型转换
                var valueType = Object.prototype.toString.call(value).slice(8, -1);
                if (metaInfo.type.indexOf(valueType) === -1) {
                    value = typeCast(value, metaInfo.type);
                }
            }
            this._data[key] = value;
            // hook
            if (metaInfo.didSet && isFunction(metaInfo.didSet)) ;
        }
        // 必须先定义snake，再定义camel，因为部分情况下 snakeCase(key) == camelCase(key)
        Object.defineProperty(this, snakeCase(key), {
            enumerable: false,
            configurable: true,
            get: getter,
            set: setter
        });
        Object.defineProperty(this, camelCase(key), {
            enumerable: true,
            configurable: true,
            get: getter,
            set: setter
        });
        this._snakeKeys.push(snakeCase(key));
        this._camelKeys.push(camelCase(key));
    };
    /**
     * 批量设置
     * @param object obj 其中key允许camel/snake
     */
    Schema.prototype.inflate = function (obj) {
        var keys = Object.keys(obj);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            if (this._metaInfo[camelCase(key)]) {
                this[key] = obj[key];
            }
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
    Schema.prototype.equal = function (to) {
        for (var i = 0, len = this._camelKeys.length; i < len; i++) {
            var key = this._camelKeys[i];
            var type = this._metaInfo[key].type;
            if (type == 'Array') {
                if (!arrayEqual(this[key], to[key])) {
                    return false;
                }
            }
            else {
                if (this[key] !== to[key]) {
                    return false;
                }
            }
        }
        return true;
    };
    return Schema;
}());
Schema.utils = {
    arrayEqual: arrayEqual
};

module.exports = Schema;
