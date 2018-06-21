define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Promise = monaco.Promise;
    var STOP_WHEN_IDLE_FOR = 2 * 60 * 1000; // 2min
    var WorkerManager = /** @class */ (function () {
        function WorkerManager(defaults) {
            this._defaults = defaults;
        }
        WorkerManager.prototype.getLanguageServiceWorker = function () {
            var resource = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                resource[_i] = arguments[_i];
            }
            var _client;
            return toShallowCancelPromise(this._getClient());
        };
        WorkerManager.prototype._getClient = function () {
            this._lastUsedTime = Date.now();
            if (!this._client) {
                this._worker = monaco.editor.createWebWorker({
                    moduleId: 'vs/language/hive/hiveWorker',
                    label: this._defaults.languageId,
                    createData: {
                        languageSettings: this._defaults.diagnosticsOptions,
                        languageId: this._defaults.languageId
                    }
                });
                this._client = this._worker.getProxy();
            }
            return this._client;
        };
        return WorkerManager;
    }());
    exports.WorkerManager = WorkerManager;
    function toShallowCancelPromise(p) {
        var completeCallback;
        var errorCallback;
        var r = new Promise(function (c, e) {
            completeCallback = c;
            errorCallback = e;
        }, function () {
        });
        p.then(completeCallback, errorCallback);
        return r;
    }
});
