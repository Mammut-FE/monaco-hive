/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
declare namespace monaco.languages.hive {
    export interface DiagnosticsOptions {
        readonly validate?: boolean;
        readonly lint?: {};
    }

    export interface LanguageServiceDefaults {
        readonly onDidChange: IEvent<LanguageServiceDefaults>;
        readonly diagnosticsOptions: DiagnosticsOptions;

        setDiagnosticsOptions(options: DiagnosticsOptions): void;
    }

    export var hiveDefaults: LanguageServiceDefaults;
}
