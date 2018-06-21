import IWorkerContext = monaco.worker.IWorkerContext;
import Promise = monaco.Promise;
import * as hiveService from './services/index';
import * as ls from 'vscode-languageserver-types';

export interface ICreateData {
    languageSettings: hiveService.LanguageSettings;
    languageId: string;
}

export class HiveWorker {
    private _ctx: IWorkerContext;
    private _languageService: any;
    private _languageSettings: any;
    private _languageId: string;

    constructor(ctx: IWorkerContext, createData: ICreateData) {
        this._ctx = ctx;
        this._languageSettings = createData.languageSettings;
        this._languageId = createData.languageId;
        this._languageService = hiveService.getLanguageService();
    }


    public doComplete(uri: string, position: ls.Position): Promise<ls.CompletionList> {
        let document = this._getTextDocument(uri);
        let completions = this._languageService.doComplete(document, position);
        return Promise.as(completions);
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

    public doValidation(uri: string): Promise<ls.Diagnostic[]> {
        let document = this._getTextDocument(uri);

        return Promise.as([]);
    }
}

export function create(ctx: IWorkerContext, createData: ICreateData): HiveWorker {
    return new HiveWorker(ctx, createData);
}
