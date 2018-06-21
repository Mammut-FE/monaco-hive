'use strict';

import { HiveWorker } from './hiveWorker';
import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import Promise = monaco.Promise;

import Uri = monaco.Uri;

export interface WorkerAccessor {
    (first: Uri, ...more: Uri[]): Promise<HiveWorker>;
}

export class DiagnosticsAdapter {
    constructor(private _languageId: string, private _worker: WorkerAccessor, defaults: LanguageServiceDefaultsImpl) {
    }
}

export class CompletionAdapter implements monaco.languages.CompletionItemProvider {
    constructor(_ctx) {

    }

    provideCompletionItems(document: monaco.editor.ITextModel, position: monaco.Position, token: monaco.CancellationToken, context: monaco.languages.CompletionContext): monaco.languages.CompletionItem[] | monaco.Thenable<monaco.languages.CompletionItem[]> | monaco.languages.CompletionList | monaco.Thenable<monaco.languages.CompletionList> {
        return undefined;
    }
}
