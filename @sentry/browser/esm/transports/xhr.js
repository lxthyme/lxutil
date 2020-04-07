import * as tslib_1 from "tslib";
import { Status } from 'lxutil/@sentry/types';
import { BaseTransport } from './base';
/** `XHR` based transport */
var XHRTransport = /** @class */ (function (_super) {
    tslib_1.__extends(XHRTransport, _super);
    function XHRTransport() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @inheritDoc
     */
    XHRTransport.prototype.sendEvent = function (event) {
        var _this = this;
        return this._buffer.add(new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState !== 4) {
                    return;
                }
                if (request.status === 200) {
                    resolve({
                        status: Status.fromHttpCode(request.status),
                    });
                }
                reject(request);
            };
            request.open('POST', _this.url);
            var p = {
                loginfo: JSON.stringify(event)
            }
            var headers = {}
            if (typeof window !== 'undefined') {
                request.setRequestHeader('serial-number', window.docCookies && window.docCookies.getItem('device_uuid') || '');
            }
            // debugger
            request.withCredentials = false
            request.setRequestHeader('type', 'web');
            request.setRequestHeader('lang', 'en');
            request.setRequestHeader('version', '3.6.1');
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify(p));
            // request.send(JSON.stringify(event));
        }));
    };
    return XHRTransport;
}(BaseTransport));
export { XHRTransport };
//# sourceMappingURL=xhr.js.map