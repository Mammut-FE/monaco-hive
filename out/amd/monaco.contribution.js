define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Emitter = monaco.Emitter;
    var LanguageServiceDefaultsImpl = /** @class */ (function () {
        function LanguageServiceDefaultsImpl(languageId, diagnosticsOptions) {
            this._onDidChange = new Emitter();
            this._languageId = languageId;
            this.setDiagnosticsOptions(diagnosticsOptions);
        }
        Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "onDidChange", {
            get: function () {
                return this._onDidChange.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "diagnosticsOptions", {
            get: function () {
                return this._diagnosticsOptions;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "languageId", {
            get: function () {
                return this._languageId;
            },
            enumerable: true,
            configurable: true
        });
        LanguageServiceDefaultsImpl.prototype.setDiagnosticsOptions = function (options) {
            this._diagnosticsOptions = options || Object.create(null);
            this._onDidChange.fire(this);
        };
        return LanguageServiceDefaultsImpl;
    }());
    exports.LanguageServiceDefaultsImpl = LanguageServiceDefaultsImpl;
    var diagnosticDefault = {
        validate: true,
        lint: {}
    };
    var hiveDefaults = new LanguageServiceDefaultsImpl('hive', diagnosticDefault);
    // Export API
    function createAPI() {
        return {
            hiveDefaults: hiveDefaults
        };
    }
    monaco.languages.hive = createAPI();
    // --- Registration to monaco editor ---
    function getMode() {
        return monaco.Promise.wrap(new Promise(function (resolve_1, reject_1) { require(['./hiveMode'], resolve_1, reject_1); }));
    }
    monaco.languages.onLanguage('hive', function () {
        getMode().then(function (mode) { return mode.setupMode(hiveDefaults); });
    });
});
