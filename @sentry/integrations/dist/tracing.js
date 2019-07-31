Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var utils_1 = require("@sentry/utils");
/**
 * Tracing Integration
 */
var Tracing = /** @class */ (function () {
    /**
     * Constructor for Tracing
     *
     * @param _options TracingOptions
     */
    function Tracing(_options) {
        if (_options === void 0) { _options = {}; }
        this._options = _options;
        /**
         * @inheritDoc
         */
        this.name = Tracing.id;
        if (!Array.isArray(_options.tracingOrigins) || _options.tracingOrigins.length === 0) {
            var defaultTracingOrigins = ['localhost', /^\//];
            utils_1.logger.warn('Sentry: You need to define `tracingOrigins` in the options. Set an array of urls or patterns to trace.');
            utils_1.logger.warn("Sentry: We added a reasonable default for you: " + defaultTracingOrigins);
            _options.tracingOrigins = defaultTracingOrigins;
        }
    }
    /**
     * @inheritDoc
     */
    Tracing.prototype.setupOnce = function (_, getCurrentHub) {
        if (this._options.traceXHR !== false) {
            this._traceXHR(getCurrentHub);
        }
        if (this._options.traceFetch !== false) {
            this._traceFetch(getCurrentHub);
        }
        if (this._options.autoStartOnDomReady !== false) {
            utils_1.getGlobalObject().addEventListener('DOMContentLoaded', function () {
                Tracing.startTrace(getCurrentHub(), utils_1.getGlobalObject().location.href);
            });
            utils_1.getGlobalObject().document.onreadystatechange = function () {
                if (document.readyState === 'complete') {
                    Tracing.startTrace(getCurrentHub(), utils_1.getGlobalObject().location.href);
                }
            };
        }
    };
    /**
     * Starts a new trace
     * @param hub The hub to start the trace on
     * @param transaction Optional transaction
     */
    Tracing.startTrace = function (hub, transaction) {
        hub.configureScope(function (scope) {
            scope.startSpan();
            scope.setTransaction(transaction);
        });
    };
    /**
     * JSDoc
     */
    Tracing.prototype._traceXHR = function (getCurrentHub) {
        if (!('XMLHttpRequest' in utils_1.getGlobalObject())) {
            return;
        }
        var xhrproto = XMLHttpRequest.prototype;
        utils_1.fill(xhrproto, 'open', function (originalOpen) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                // @ts-ignore
                var self = getCurrentHub().getIntegration(Tracing);
                if (self) {
                    self._xhrUrl = args[1];
                }
                // tslint:disable-next-line: no-unsafe-any
                return originalOpen.apply(this, args);
            };
        });
        utils_1.fill(xhrproto, 'send', function (originalSend) {
            return function () {
                var _this = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                // @ts-ignore
                var self = getCurrentHub().getIntegration(Tracing);
                if (self && self._xhrUrl && self._options.tracingOrigins) {
                    var url_1 = self._xhrUrl;
                    var headers_1 = getCurrentHub().traceHeaders();
                    // tslint:disable-next-line: prefer-for-of
                    var isWhitelisted = self._options.tracingOrigins.some(function (origin) {
                        return utils_1.isMatchingPattern(url_1, origin);
                    });
                    if (isWhitelisted && this.setRequestHeader) {
                        Object.keys(headers_1).forEach(function (key) {
                            _this.setRequestHeader(key, headers_1[key]);
                        });
                    }
                }
                // tslint:disable-next-line: no-unsafe-any
                return originalSend.apply(this, args);
            };
        });
    };
    /**
     * JSDoc
     */
    Tracing.prototype._traceFetch = function (getCurrentHub) {
        if (!utils_1.supportsNativeFetch()) {
            return;
        }
        // tslint:disable: only-arrow-functions
        utils_1.fill(utils_1.getGlobalObject(), 'fetch', function (originalFetch) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                // @ts-ignore
                var self = getCurrentHub().getIntegration(Tracing);
                if (self && self._options.tracingOrigins) {
                    var url_2 = args[0];
                    var options = (args[1] = args[1] || {});
                    var whiteListed_1 = false;
                    self._options.tracingOrigins.forEach(function (whiteListUrl) {
                        if (!whiteListed_1) {
                            whiteListed_1 = utils_1.isMatchingPattern(url_2, whiteListUrl);
                        }
                    });
                    if (whiteListed_1) {
                        if (options.headers) {
                            if (Array.isArray(options.headers)) {
                                options.headers = tslib_1.__spread(options.headers, Object.entries(getCurrentHub().traceHeaders()));
                            }
                            else {
                                options.headers = tslib_1.__assign({}, options.headers, getCurrentHub().traceHeaders());
                            }
                        }
                        else {
                            options.headers = getCurrentHub().traceHeaders();
                        }
                    }
                }
                // tslint:disable-next-line: no-unsafe-any
                return originalFetch.apply(utils_1.getGlobalObject(), args);
            };
        });
        // tslint:enable: only-arrow-functions
    };
    /**
     * @inheritDoc
     */
    Tracing.id = 'Tracing';
    return Tracing;
}());
exports.Tracing = Tracing;
//# sourceMappingURL=tracing.js.map