/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Netease Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { HiveWorker } from './hiveWorker';
import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import Promise = monaco.Promise;
import Uri = monaco.Uri;

const STOP_WHEN_IDLE_FOR = 20 * 60 * 1000; // 2min

export class WorkerManager {
    private _defaults: LanguageServiceDefaultsImpl;
    private _lastUsedTime: number;
    private _client: Promise<HiveWorker>;
    private _worker: monaco.editor.MonacoWebWorker<HiveWorker>;
    private _idleCheckInterval: number;
    private _configChangeListener: monaco.IDisposable;

    constructor(defaults: LanguageServiceDefaultsImpl) {
        this._defaults = defaults;
        this._worker = null;
        this._idleCheckInterval = window.setInterval(() => this._checkIdle(), 30 * 1000);
        this._lastUsedTime = 0;
        this._configChangeListener = this._defaults.onDidChange(() => {
            this._stopWorker();
        });
    }

    getLanguageServiceWorker(...resource: Uri[]): Promise<HiveWorker> {
        let _client: HiveWorker;
        return toShallowCancelPromise(
            this._getClient()
                .then(client => {
                    _client = client;
                })
                .then(_ => {
                    return this._worker.withSyncedResources(resource);
                })
                .then(_ => _client)
        );
    }

    private _checkIdle(): void {
        if (!this._worker) {
            return;
        }

        let timePassedSinceLastUsed = Date.now() - this._lastUsedTime;
        if (timePassedSinceLastUsed > STOP_WHEN_IDLE_FOR) {
            this._stopWorker();
        }
    }

    private _getClient(): Promise<HiveWorker> {
        this._lastUsedTime = Date.now();

        if (!this._client) {
            this._worker = monaco.editor.createWebWorker<HiveWorker>({
                // module that exports the create() method and returns a `hiveWorker` instance
                moduleId: 'vs/language/hive/hiveWorker',

                label: this._defaults.languageId,

                // passed in to the create() method
                createData: {
                    languageSettings: this._defaults.diagnosticsOptions,
                    languageId: this._defaults.languageId
                }
            });

            this._client = this._worker.getProxy();
        }

        return this._client;
    }

    private _stopWorker(): void {
        if (this._worker) {
            this._worker.dispose();
            this._worker = null;
        }
        this._client = null;
    }
}

function toShallowCancelPromise<T>(p: Promise<T>): Promise<T> {
    let completeCallback: (value: T) => void;
    let errorCallback: (err: any) => void;

    let r = new Promise<T>(
        (c, e) => {
            completeCallback = c;
            errorCallback = e;
        },
        () => {
        }
    );

    p.then(completeCallback, errorCallback);

    return r;
}
