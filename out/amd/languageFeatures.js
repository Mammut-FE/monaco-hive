define(["require", "exports"], function (require, exports) {
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
