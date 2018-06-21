'use strict';
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker';
import { HiveWorker } from './hiveWorker';
self.onmessage = function () {
    worker.initialize(function (ctx, createData) {
        return new HiveWorker(ctx, createData);
    });
};
