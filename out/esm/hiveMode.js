'use strict';
import { WorkerManager } from './workerManager';
import * as languageFeatures from './languageFeatures';
export function setupMode(defaults) {
    var client = new WorkerManager(defaults);
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
