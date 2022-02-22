
/** 有效值*/
exports.isDef = function (val: any) {
    return val !== undefined && val !== null && val.trim() !== "";
}

/**  Function */
var isFunctionSelf = exports.isFunction = function (val: any) {
    return typeof val === 'function';
}

/**  RegExp */
exports.isRegExp = function (val: any) {
    return Object.prototype.toString.call(val) === "[object RegExp]";
}


/**  Object */
var isObjectSelf = exports.isObject = function (val: any) {
    return val !== null && typeof val === 'object';
}

/**  Promise*/
exports.isPromise = function (val: any) {
    return isObjectSelf(val) && isFunctionSelf(val.then) && isFunctionSelf(val.catch);
}

/**  空对象*/
exports.isEmpty = function (val: any) {
    if (val == null) {
        return true;
    }

    if (typeof val !== 'object') {
        return true;
    }
    return Object.keys(val).length === 0;
}

/** NaN */
exports.isNaN = function (val: any) {
    if (Number.isNaN) {
        return Number.isNaN(val);
    }
    return val !== val;
}

/** Date */
exports.isDate = function (val: any) {
    return Object.prototype.toString.call(val) === '[object Date]' && !isNaN(val.getTime());
}

