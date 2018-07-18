/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Netease Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as mode from './hiveMode';
import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;

export class LanguageServiceDefaultsImpl implements monaco.languages.hive.LanguageServiceDefaults {
  private readonly _languageId: string;
  
  constructor(languageId: string, diagnosticsOptions: monaco.languages.hive.DiagnosticsOptions) {
    this._languageId = languageId;
    this.setDiagnosticsOptions(diagnosticsOptions);
  }
  
  private _onDidChange = new Emitter<monaco.languages.hive.LanguageServiceDefaults>();
  
  get onDidChange(): IEvent<monaco.languages.hive.LanguageServiceDefaults> {
    return this._onDidChange.event;
  }
  
  private _diagnosticsOptions: monaco.languages.hive.DiagnosticsOptions;
  
  get diagnosticsOptions(): monaco.languages.hive.DiagnosticsOptions {
    return this._diagnosticsOptions;
  }
  
  get languageId(): string {
    return this._languageId;
  }
  
  setDiagnosticsOptions(options: monaco.languages.hive.DiagnosticsOptions): void {
    this._diagnosticsOptions = options || Object.create(null);
    this._onDidChange.fire(this);
  }
}

const diagnosticDefault: monaco.languages.hive.DiagnosticsOptions = {
  validate: true,
  lint: {}
};
const hiveDefaults = new LanguageServiceDefaultsImpl('hive', diagnosticDefault);

// Export API
function createAPI(): typeof monaco.languages.hive {
  return {
    hiveDefaults: hiveDefaults
  };
}

monaco.languages.hive = createAPI();

// --- Registration to monaco editor ---

function getMode(): monaco.Promise<typeof mode> {
  return monaco.Promise.wrap(import('./hiveMode'));
}

monaco.languages.onLanguage('hive', () => {
  getMode().then(mode => mode.setupMode(hiveDefaults));
});
