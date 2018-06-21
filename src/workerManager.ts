import { HiveWorker } from './hiveWorker';
import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import Promise = monaco.Promise;
import Uri = monaco.Uri;

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000; // 2min

export class WorkerManager {
    private _defaults: LanguageServiceDefaultsImpl;
    private _lastUsedTime: number;
    private _client: Promise<HiveWorker>;
    private _worker: monaco.editor.MonacoWebWorker<HiveWorker>;

    constructor(defaults: LanguageServiceDefaultsImpl) {
        this._defaults = defaults;
    }

    getLanguageServiceWorker(...resource: Uri[]): Promise<HiveWorker> {
        let _client: HiveWorker;

        return toShallowCancelPromise(this._getClient());
    }

    private _getClient(): Promise<HiveWorker> {
        this._lastUsedTime = Date.now();

        if (!this._client) {
            this._worker = monaco.editor.createWebWorker<HiveWorker>({
                moduleId: 'vs/language/hive/hiveWorker',

                label: this._defaults.languageId,

                createData: {
                    languageSettings: this._defaults.diagnosticsOptions,
                    languageId: this._defaults.languageId
                }
            });

            this._client = this._worker.getProxy();
        }

        return this._client;
    }
}

function toShallowCancelPromise<T>(p: Promise<T>): Promise<T> {
    let completeCallback: (value: T) => void;
    let errorCallback: (err: any) => void;

    let r = new Promise<T>((c, e) => {
        completeCallback = c;
        errorCallback = e;
    }, () => {
    });

    p.then(completeCallback, errorCallback);

    return r;
}
