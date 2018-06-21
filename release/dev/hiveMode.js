define('vs/language/hive/workerManager',["require", "exports"], function (require, exports) {
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

define('vs/language/hive/languageFeatures',["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var DiagnosticsAdapter = /** @class */ (function () {
        function DiagnosticsAdapter(_languageId, _worker, defaults) {
            this._languageId = _languageId;
            this._worker = _worker;
        }
        return DiagnosticsAdapter;
    }());
    exports.DiagnosticsAdapter = DiagnosticsAdapter;
    var CompletionAdapter = /** @class */ (function () {
        function CompletionAdapter(_ctx) {
        }
        CompletionAdapter.prototype.provideCompletionItems = function (document, position, token, context) {
            return undefined;
        };
        return CompletionAdapter;
    }());
    exports.CompletionAdapter = CompletionAdapter;
});

define('vs/language/hive/hiveMode',["require", "exports", "./workerManager", "./languageFeatures"], function (require, exports, workerManager_1, languageFeatures) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function setupMode(defaults) {
        var client = new workerManager_1.WorkerManager(defaults);
        var worker = function (first) {
            var more = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                more[_i - 1] = arguments[_i];
            }
            return client.getLanguageServiceWorker.apply(client, [first].concat(more));
        };
        var languageId = defaults.languageId;
        monaco.languages.registerCompletionItemProvider(languageId, new languageFeatures.CompletionAdapter(worker));
        new languageFeatures.DiagnosticsAdapter(languageId, worker, defaults);
    }
    exports.setupMode = setupMode;
});

