define(["require", "exports", "./services/index", "vscode-languageserver-types"], function (require, exports, hiveService, ls) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Promise = monaco.Promise;
    var HiveWorker = /** @class */ (function () {
        function HiveWorker(ctx, createData) {
            this._ctx = ctx;
            this._languageSettings = createData.languageSettings;
            this._languageId = createData.languageId;
            this._languageService = hiveService.getLanguageService();
        }
        HiveWorker.prototype.doComplete = function (uri, position) {
            var document = this._getTextDocument(uri);
            var completions = this._languageService.doComplete(document, position);
            return Promise.as(completions);
        };
        HiveWorker.prototype._getTextDocument = function (uri) {
            var models = this._ctx.getMirrorModels();
            for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
                var model = models_1[_i];
                if (model.uri.toString() === uri) {
                    return ls.TextDocument.create(uri, this._languageId, model.version, model.getValue());
                }
            }
            return null;
        };
        return HiveWorker;
    }());
    exports.HiveWorker = HiveWorker;
    function create(ctx, createData) {
        return new HiveWorker(ctx, createData);
    }
    exports.create = create;
});
