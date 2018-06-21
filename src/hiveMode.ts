'use strict';

import {WorkerManager} from './workerManager';
import {HiveWorker} from './hiveWorker';
import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import * as languageFeatures from './languageFeatures';

import Promise = monaco.Promise;
import Uri = monaco.Uri;

export function setupMode(defaults: LanguageServiceDefaultsImpl): void {
    const client = new WorkerManager(defaults);

    const worker = (first: Uri, ...more: Uri[]): Promise<HiveWorker> => {
        return client.getLanguageServiceWorker(...[first].concat(more));
    };

    let languageId = defaults.languageId;

    monaco.languages.registerCompletionItemProvider(languageId, new languageFeatures.CompletionAdapter(worker));
    new languageFeatures.DiagnosticsAdapter(languageId, worker, defaults);
}
