(function (__window) {
var exports = {};

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

var setPrototypeOf = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties); // tslint:disable-line:no-unbound-method
/**
 * setPrototypeOf polyfill using __proto__
 */
function setProtoOf(obj, proto) {
    // @ts-ignore
    obj.__proto__ = proto;
    return obj;
}
/**
 * setPrototypeOf polyfill using mixin
 */
function mixinProperties(obj, proto) {
    for (var prop in proto) {
        if (!obj.hasOwnProperty(prop)) {
            // @ts-ignore
            obj[prop] = proto[prop];
        }
    }
    return obj;
}

/** An error emitted by Sentry SDKs and related utilities. */
var SentryError = /** @class */ (function (_super) {
    __extends(SentryError, _super);
    function SentryError(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        _this.message = message;
        // tslint:disable:no-unsafe-any
        _this.name = _newTarget.prototype.constructor.name;
        setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return SentryError;
}(Error));

/**
 * Checks whether given value's type is one of a few Error or Error-like
 * {@link isError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isError(wat) {
    switch (Object.prototype.toString.call(wat)) {
        case '[object Error]':
            return true;
        case '[object Exception]':
            return true;
        case '[object DOMException]':
            return true;
        default:
            return wat instanceof Error;
    }
}
/**
 * Checks whether given value's is a primitive (undefined, null, number, boolean, string)
 * {@link isPrimitive}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isPrimitive(wat) {
    return wat === null || (typeof wat !== 'object' && typeof wat !== 'function');
}
/**
 * Checks whether given value's type is an object literal
 * {@link isPlainObject}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isPlainObject(wat) {
    return Object.prototype.toString.call(wat) === '[object Object]';
}
/**
 * Checks whether given value's type is a SyntheticEvent
 * {@link isSyntheticEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isSyntheticEvent(wat) {
    // tslint:disable-next-line:no-unsafe-any
    return isPlainObject(wat) && 'nativeEvent' in wat && 'preventDefault' in wat && 'stopPropagation' in wat;
}

/**
 * Requires a module which is protected _against bundler minification.
 *
 * @param request The module path to resolve
 */
/**
 * Checks whether we're in the Node.js or Browser environment
 *
 * @returns Answer to given question
 */
function isNodeEnv() {
    // tslint:disable:strict-type-predicates
    return Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
}
var fallbackGlobalObject = {};
/**
 * Safely get global scope object
 *
 * @returns Global scope object
 */
function getGlobalObject() {
    return (isNodeEnv()
        ? global
        : typeof window !== 'undefined'
            ? window
            : typeof self !== 'undefined'
                ? self
                : fallbackGlobalObject);
}
/** JSDoc */
function consoleSandbox(callback) {
    var global = getGlobalObject();
    var levels = ['debug', 'info', 'warn', 'error', 'log', 'assert'];
    if (!('console' in global)) {
        return callback();
    }
    var originalConsole = global.console;
    var wrappedLevels = {};
    // Restore all wrapped console methods
    levels.forEach(function (level) {
        if (level in global.console && originalConsole[level].__sentry__) {
            wrappedLevels[level] = originalConsole[level].__sentry_wrapped__;
            originalConsole[level] = originalConsole[level].__sentry_original__;
        }
    });
    // Perform callback manipulations
    var result = callback();
    // Revert restoration to wrapped state
    Object.keys(wrappedLevels).forEach(function (level) {
        originalConsole[level] = wrappedLevels[level];
    });
    return result;
}

// TODO: Implement different loggers for different environments
var global$1 = getGlobalObject();
/** Prefix for logging strings */
var PREFIX = 'Sentry Logger ';
/** JSDoc */
var Logger = /** @class */ (function () {
    /** JSDoc */
    function Logger() {
        this._enabled = false;
    }
    /** JSDoc */
    Logger.prototype.disable = function () {
        this._enabled = false;
    };
    /** JSDoc */
    Logger.prototype.enable = function () {
        this._enabled = true;
    };
    /** JSDoc */
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this._enabled) {
            return;
        }
        consoleSandbox(function () {
            global$1.console.log(PREFIX + "[Log]: " + args.join(' ')); // tslint:disable-line:no-console
        });
    };
    /** JSDoc */
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this._enabled) {
            return;
        }
        consoleSandbox(function () {
            global$1.console.warn(PREFIX + "[Warn]: " + args.join(' ')); // tslint:disable-line:no-console
        });
    };
    /** JSDoc */
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this._enabled) {
            return;
        }
        consoleSandbox(function () {
            global$1.console.error(PREFIX + "[Error]: " + args.join(' ')); // tslint:disable-line:no-console
        });
    };
    return Logger;
}());
// Ensure we only have a single logger instance, even if multiple versions of @sentry/utils are being used
global$1.__SENTRY__ = global$1.__SENTRY__ || {};
var logger = global$1.__SENTRY__.logger || (global$1.__SENTRY__.logger = new Logger());

// tslint:disable:no-unsafe-any
/**
 * Memo class used for decycle json objects. Uses WeakSet if available otherwise array.
 */
var Memo = /** @class */ (function () {
    function Memo() {
        // tslint:disable-next-line
        this._hasWeakSet = typeof WeakSet === 'function';
        this._inner = this._hasWeakSet ? new WeakSet() : [];
    }
    /**
     * Sets obj to remember.
     * @param obj Object to remember
     */
    Memo.prototype.memoize = function (obj) {
        if (this._hasWeakSet) {
            if (this._inner.has(obj)) {
                return true;
            }
            this._inner.add(obj);
            return false;
        }
        // tslint:disable-next-line:prefer-for-of
        for (var i = 0; i < this._inner.length; i++) {
            var value = this._inner[i];
            if (value === obj) {
                return true;
            }
        }
        this._inner.push(obj);
        return false;
    };
    /**
     * Removes object from internal storage.
     * @param obj Object to forget
     */
    Memo.prototype.unmemoize = function (obj) {
        if (this._hasWeakSet) {
            this._inner.delete(obj);
        }
        else {
            for (var i = 0; i < this._inner.length; i++) {
                if (this._inner[i] === obj) {
                    this._inner.splice(i, 1);
                    break;
                }
            }
        }
    };
    return Memo;
}());

/**
 * Transforms Error object into an object literal with all it's attributes
 * attached to it.
 *
 * Based on: https://github.com/ftlabs/js-abbreviate/blob/fa709e5f139e7770a71827b1893f22418097fbda/index.js#L95-L106
 *
 * @param error An Error containing all relevant information
 * @returns An object with all error properties
 */
function objectifyError(error) {
    // These properties are implemented as magical getters and don't show up in `for-in` loop
    var err = {
        message: error.message,
        name: error.name,
        stack: error.stack,
    };
    for (var i in error) {
        if (Object.prototype.hasOwnProperty.call(error, i)) {
            err[i] = error[i];
        }
    }
    return err;
}
/** Transforms any input value into a string form, either primitive value or a type of the input */
function serializeValue(value) {
    var type = Object.prototype.toString.call(value);
    // Node.js REPL notation
    if (typeof value === 'string') {
        return value;
    }
    if (type === '[object Object]') {
        return '[Object]';
    }
    if (type === '[object Array]') {
        return '[Array]';
    }
    var normalized = normalizeValue(value);
    return isPrimitive(normalized) ? normalized : type;
}
/**
 * normalizeValue()
 *
 * Takes unserializable input and make it serializable friendly
 *
 * - translates undefined/NaN values to "[undefined]"/"[NaN]" respectively,
 * - serializes Error objects
 * - filter global objects
 */
function normalizeValue(value, key) {
    if (key === 'domain' && typeof value === 'object' && value._events) {
        return '[Domain]';
    }
    if (key === 'domainEmitter') {
        return '[DomainEmitter]';
    }
    if (typeof global !== 'undefined' && value === global) {
        return '[Global]';
    }
    if (typeof window !== 'undefined' && value === window) {
        return '[Window]';
    }
    if (typeof document !== 'undefined' && value === document) {
        return '[Document]';
    }
    // tslint:disable-next-line:strict-type-predicates
    if (typeof Event !== 'undefined' && value instanceof Event) {
        return Object.getPrototypeOf(value) ? value.constructor.name : 'Event';
    }
    // React's SyntheticEvent thingy
    if (isSyntheticEvent(value)) {
        return '[SyntheticEvent]';
    }
    if (Number.isNaN(value)) {
        return '[NaN]';
    }
    if (value === void 0) {
        return '[undefined]';
    }
    if (typeof value === 'function') {
        return "[Function: " + (value.name || '<unknown-function-name>') + "]";
    }
    return value;
}
/**
 * Walks an object to perform a normalization on it
 *
 * @param key of object that's walked in current iteration
 * @param value object to be walked
 * @param depth Optional number indicating how deep should walking be performed
 * @param memo Optional Memo class handling decycling
 */
function walk(key, value, depth, memo) {
    if (depth === void 0) { depth = +Infinity; }
    if (memo === void 0) { memo = new Memo(); }
    // If we reach the maximum depth, serialize whatever has left
    if (depth === 0) {
        return serializeValue(value);
    }
    // If value implements `toJSON` method, call it and return early
    // tslint:disable:no-unsafe-any
    if (value !== null && value !== undefined && typeof value.toJSON === 'function') {
        return value.toJSON();
    }
    // tslint:enable:no-unsafe-any
    // If normalized value is a primitive, there are no branches left to walk, so we can just bail out, as theres no point in going down that branch any further
    var normalized = normalizeValue(value, key);
    if (isPrimitive(normalized)) {
        return normalized;
    }
    // Create source that we will use for next itterations, either objectified error object (Error type with extracted keys:value pairs) or the input itself
    var source = (isError(value) ? objectifyError(value) : value);
    // Create an accumulator that will act as a parent for all future itterations of that branch
    var acc = Array.isArray(value) ? [] : {};
    // If we already walked that branch, bail out, as it's circular reference
    if (memo.memoize(value)) {
        return '[Circular ~]';
    }
    // Walk all keys of the source
    for (var innerKey in source) {
        // Avoid iterating over fields in the prototype if they've somehow been exposed to enumeration.
        if (!Object.prototype.hasOwnProperty.call(source, innerKey)) {
            continue;
        }
        // Recursively walk through all the child nodes
        acc[innerKey] = walk(innerKey, source[innerKey], depth - 1, memo);
    }
    // Once walked through all the branches, remove the parent from memo storage
    memo.unmemoize(value);
    // Return accumulated values
    return acc;
}
/**
 * normalize()
 *
 * - Creates a copy to prevent original input mutation
 * - Skip non-enumerablers
 * - Calls `toJSON` if implemented
 * - Removes circular references
 * - Translates non-serializeable values (undefined/NaN/Functions) to serializable format
 * - Translates known global objects/Classes to a string representations
 * - Takes care of Error objects serialization
 * - Optionally limit depth of final output
 */
function normalize(input, depth) {
    try {
        // tslint:disable-next-line:no-unsafe-any
        return JSON.parse(JSON.stringify(input, function (key, value) { return walk(key, value, depth); }));
    }
    catch (_oO) {
        return '**non-serializable**';
    }
}

// Slightly modified (no IE8 support, ES6) and transcribed to TypeScript

/** SyncPromise internal states */
var States;
(function (States) {
    /** Pending */
    States["PENDING"] = "PENDING";
    /** Resolved / OK */
    States["RESOLVED"] = "RESOLVED";
    /** Rejected / Error */
    States["REJECTED"] = "REJECTED";
})(States || (States = {}));

/** Patch toString calls to return proper name for wrapped functions */
var ExtraErrorData = /** @class */ (function () {
    /**
     * @inheritDoc
     */
    function ExtraErrorData(_options) {
        if (_options === void 0) { _options = { depth: 3 }; }
        this._options = _options;
        /**
         * @inheritDoc
         */
        this.name = ExtraErrorData.id;
    }
    /**
     * @inheritDoc
     */
    ExtraErrorData.prototype.setupOnce = function (addGlobalEventProcessor, getCurrentHub) {
        addGlobalEventProcessor(function (event, hint) {
            var self = getCurrentHub().getIntegration(ExtraErrorData);
            if (!self) {
                return event;
            }
            return self.enhanceEventWithErrorData(event, hint);
        });
    };
    /**
     * Attaches extracted information from the Error object to extra field in the Event
     */
    ExtraErrorData.prototype.enhanceEventWithErrorData = function (event, hint) {
        if (!hint || !hint.originalException || !isError(hint.originalException)) {
            return event;
        }
        var errorData = this._extractErrorData(hint.originalException);
        if (errorData) {
            var extra = __assign({}, event.extra);
            var normalizedErrorData = normalize(errorData, this._options.depth);
            if (isPlainObject(normalizedErrorData)) {
                extra = __assign({}, event.extra, normalizedErrorData);
            }
            return __assign({}, event, { extra: extra });
        }
        return event;
    };
    /**
     * Extract extra information from the Error object
     */
    ExtraErrorData.prototype._extractErrorData = function (error) {
        var e_1, _a, _b;
        var result = null;
        // We are trying to enhance already existing event, so no harm done if it won't succeed
        try {
            var nativeKeys_1 = ['name', 'message', 'stack', 'line', 'column', 'fileName', 'lineNumber', 'columnNumber'];
            var name_1 = error.name || error.constructor.name;
            var errorKeys = Object.getOwnPropertyNames(error).filter(function (key) { return nativeKeys_1.indexOf(key) === -1; });
            if (errorKeys.length) {
                var extraErrorInfo = {};
                try {
                    for (var errorKeys_1 = __values(errorKeys), errorKeys_1_1 = errorKeys_1.next(); !errorKeys_1_1.done; errorKeys_1_1 = errorKeys_1.next()) {
                        var key = errorKeys_1_1.value;
                        var value = error[key];
                        if (isError(value)) {
                            value = value.toString();
                        }
                        // tslint:disable:no-unsafe-any
                        extraErrorInfo[key] = value;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (errorKeys_1_1 && !errorKeys_1_1.done && (_a = errorKeys_1.return)) _a.call(errorKeys_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                result = (_b = {},
                    _b[name_1] = extraErrorInfo,
                    _b);
            }
        }
        catch (oO) {
            logger.error('Unable to extract extra data from the Error object:', oO);
        }
        return result;
    };
    /**
     * @inheritDoc
     */
    ExtraErrorData.id = 'ExtraErrorData';
    return ExtraErrorData;
}());

exports.ExtraErrorData = ExtraErrorData;


  __window.Sentry = __window.Sentry || {};
  __window.Sentry.Integrations = __window.Sentry.Integrations || {};
  Object.assign(__window.Sentry.Integrations, exports);
  
}(window));
//# sourceMappingURL=extraerrordata.js.map
