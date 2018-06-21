'use strict';

import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker';
import { HiveWorker } from './hiveWorker';

self.onmessage = () => {
    worker.initialize((ctx, createData) => {
        return new HiveWorker(ctx, createData);
    });
};
