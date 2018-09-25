/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
declare namespace monaco.languages.hive {
    export interface DiagnosticsOptions {
        readonly validate?: boolean;
        readonly lint?: {};
        readonly databases?: IDatabase[];
    }

    export interface LanguageServiceDefaults {
        readonly onDidChange: IEvent<LanguageServiceDefaults>;
        readonly diagnosticsOptions: DiagnosticsOptions;

        setDiagnosticsOptions(options: DiagnosticsOptions): void;
    }

    export var hiveDefaults: LanguageServiceDefaults;

    export interface IDatabaseServices {
        getDatabaseList(): IDatabase[];

        getTables(db: string): ITable[];

        getColumns(db: string, table: string): IColumn[];
    }

    export interface IDatabase {
        name: string;
        tables: ITable[];

        [key: string]: any;
    }

    export interface ITable {
        name: string;
        columns: IColumn[];

        [key: string]: any;

    }

    export interface IColumn {
        name: string;

        [key: string]: any;
    }
}
