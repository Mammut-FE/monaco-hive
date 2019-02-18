/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Netease Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as hiveService from 'vscode-hive-languageservice';
import * as ls from 'vscode-languageserver-types';
import CompletionItem = monaco.languages.CompletionItem;
import CompletionList = monaco.languages.CompletionList;
import DiagnosticsOptions = monaco.languages.hive.DiagnosticsOptions;
import Promise = monaco.Promise;
import IWorkerContext = monaco.worker.IWorkerContext;

export interface ICreateData {
    languageSettings: hiveService.LanguageSettings;
    languageId: string;
}

export class HiveWorker {
    private _ctx: IWorkerContext;
    private _languageService: hiveService.LanguageService;
    private _languageSettings: DiagnosticsOptions;
    private _languageId: string;

    constructor(ctx: IWorkerContext, createData: ICreateData) {
        this._ctx = ctx;
        this._languageSettings = createData.languageSettings;
        this._languageId = createData.languageId;
        this._languageService = hiveService.getLanguageService();
    }

    public doComplete(uri: string, position: ls.Position, offset: number): Promise<CompletionList> {
        let document = this._getTextDocument(uri);
        let text = document.getText();
        let wordAtOffset = text[offset - 1];

        if (wordAtOffset === '$' && this._languageSettings.azkabanCompletions) {
            const completions = {
                isIncomplete: false,
                items: this._createAzkabanCompletions(this._languageSettings.azkabanCompletions)
            };

            return Promise.as(completions);
        }

        if (wordAtOffset === '.' || wordAtOffset === ',') {
            text = text.substr(0, offset) + 'PLACEHOLDER' + text.substr(offset);
        }

        let program = this._languageService.parseProgram(text);
        let completions = this._languageService.doComplete(document, position, program, this._languageSettings.databases);

        return Promise.as(completions);
    }

    public doValidation(uri: string): Promise<ls.Diagnostic[]> {
        const document = this._getTextDocument(uri);
        const text = document.getText();

        return this._languageService.doValidation(text);
    }

    private _getTextDocument(uri: string): ls.TextDocument {
        let models = this._ctx.getMirrorModels();
        for (let model of models) {
            if (model.uri.toString() === uri) {
                return ls.TextDocument.create(uri, this._languageId, model.version, model.getValue());
            }
        }
        return null;
    }

    private _createAzkabanCompletions(completions: string[]): CompletionItem[] {
        return completions.map(label => {
            return {
                label,
                insertText: label.substr(1),
                kind: 5, // monaco.languages.CompletionItemKind.Variable
                sortText: 'g',
                detail: 'azkaban'
            };
        });
    }
}

export function create(ctx: IWorkerContext, createData: ICreateData): HiveWorker {
    return new HiveWorker(ctx, createData);
}
