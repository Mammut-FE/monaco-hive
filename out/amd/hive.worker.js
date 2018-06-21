define(["require", "exports", "monaco-editor-core/esm/vs/editor/editor.worker", "./hiveWorker"], function (require, exports, worker, hiveWorker_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    self.onmessage = function () {
        worker.initialize(function (ctx, createData) {
            return new hiveWorker_1.HiveWorker(ctx, createData);
        });
    };
});
