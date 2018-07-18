/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Netease Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker';
import { HiveWorker } from './hiveWorker';

self.onmessage = () => {
  worker.initialize((ctx, createData) => {
    return new HiveWorker(ctx, createData);
  });
};
