/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Netease Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as ls from 'vscode-languageserver-types';
import { HiveWorker } from './hiveWorker';
import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import CancellationToken = monaco.CancellationToken;
import IDisposable = monaco.IDisposable;
import Position = monaco.Position;
import Promise = monaco.Promise;
import Thenable = monaco.Thenable;
import Uri = monaco.Uri;

export interface WorkerAccessor {
  (first: Uri, ...more: Uri[]): Promise<HiveWorker>;
}

/**
 * 语法检查
 */
export class DiagnosticsAdapter {
  private _disposables: IDisposable[] = [];
  private _listener: { [uri: string]: IDisposable } = Object.create(null);
  
  constructor(private _languageId: string, private _worker: WorkerAccessor, defaults: LanguageServiceDefaultsImpl) {
    const onModelAdd = (model: monaco.editor.IModel): void => {
      let modeId = model.getModeId();
      if (modeId !== this._languageId) {
        return;
      }
      
      let handle: number;
      this._listener[model.uri.toString()] = model.onDidChangeContent(() => {
        clearTimeout(handle);
        handle = setTimeout(() => this._doValidate(model.uri, modeId), 500);
      });
      this._doValidate(model.uri, modeId);
    };
    
    const onModelRemoved = (model: monaco.editor.IModel): void => {
      monaco.editor.setModelMarkers(model, this._languageId, []);
      
      let uriStr = model.uri.toString();
      let listener = this._listener[uriStr];
      if (listener) {
        listener.dispose();
        delete this._listener[uriStr];
      }
    };
    
    this._disposables.push(monaco.editor.onDidCreateModel(onModelAdd));
    this._disposables.push(monaco.editor.onWillDisposeModel(onModelRemoved));
    this._disposables.push(monaco.editor.onDidChangeModelLanguage(event => {
      onModelRemoved(event.model);
      onModelAdd(event.model);
    }));
    
    defaults.onDidChange(_ => {
      monaco.editor.getModels().forEach(model => {
        if (model.getModeId() === this._languageId) {
          onModelRemoved(model);
          onModelAdd(model);
        }
      });
    });
    
    this._disposables.push({
      dispose: () => {
        for (let key in this._listener) {
          this._listener[key].dispose();
        }
      }
    });
    
    monaco.editor.getModels().forEach(onModelAdd);
  }
  
  public dispose(): void {
    this._disposables.forEach(d => d && d.dispose());
    this._disposables = [];
  }
  
  private _doValidate(resource: monaco.Uri, languageId: string) {
    this._worker(resource)
    .then(worker => {
      return worker.doValidation(resource.toString());
    })
    .then(diagnostics => {
      const markers = diagnostics.map(d => toDiagnostics(resource, d));
      let model = monaco.editor.getModel(resource);
      if (model.getModeId() === languageId) {
        monaco.editor.setModelMarkers(model, languageId, markers);
      }
    })
    .done(undefined, err => {
      console.error(err);
    });
  }
}

function toSeverity(lsSeverity: number): monaco.MarkerSeverity {
  switch (lsSeverity) {
    case ls.DiagnosticSeverity.Error:
      return monaco.MarkerSeverity.Error;
    case ls.DiagnosticSeverity.Warning:
      return monaco.MarkerSeverity.Warning;
    case ls.DiagnosticSeverity.Information:
      return monaco.MarkerSeverity.Info;
    case ls.DiagnosticSeverity.Hint:
      return monaco.MarkerSeverity.Hint;
    default:
      return monaco.MarkerSeverity.Info;
  }
}

function toDiagnostics(resource: Uri, diag: ls.Diagnostic): monaco.editor.IMarkerData {
  let code = typeof diag.code === 'number' ? String(diag.code) : <string>diag.code;
  
  return {
    severity: toSeverity(diag.severity),
    startLineNumber: diag.range.start.line + 1,
    startColumn: diag.range.start.character + 1,
    endLineNumber: diag.range.end.line + 1,
    endColumn: diag.range.end.character + 1,
    message: diag.message,
    code: code,
    source: diag.source
  };
}

export class CompletionAdapter implements monaco.languages.CompletionItemProvider {
    constructor(private  _worker: WorkerAccessor) {
  
  }

    public get triggerCharacters(): string[] {
        return [' ', '.'];
    }

    provideCompletionItems(model: monaco.editor.ITextModel, position: monaco.Position, token: monaco.CancellationToken, context: monaco.languages.CompletionContext): Thenable<monaco.languages.CompletionList> {
        const wordInfo = model.getWordUntilPosition(position);
        const resource = model.uri;

        return wireCancellationToken(token, this._worker(resource).then(worker => {
            return worker.doComplete(resource.toString(), fromPosition(position));
        })).then(info => {
            return info;
        });
    }
}

function fromPosition(position: Position): ls.Position {
    if (!position) {
        return void 0;
    }

    return {
        character: position.column - 1,
        line: position.lineNumber - 1
    };
}

/**
 * Hook a cancellation token to a WinJS Promise
 */
function wireCancellationToken<T>(token: CancellationToken, promise: Promise<T>): Thenable<T> {
    token.onCancellationRequested(() => promise.cancel());
    return promise;
}
