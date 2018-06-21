const requirejs = require('requirejs');
const path = require('path');
const fs = require('fs');
const UglifyJS = require('uglify-js');
const helpers = require('monaco-plugin-helpers');

const REPO_ROOT = path.resolve(__dirname, '..');

const sha1 = helpers.getGitVersion(REPO_ROOT);
const semver = require('../package.json').version;
const headerVersion = semver + '(' + sha1 + ')';

const BUNDLED_FILE_HEADER = [
    '/*!-----------------------------------------------------------------------------',
    ' * Copyright (c) Microsoft Corporation. All rights reserved.',
    ' * monaco-hive version: ' + headerVersion,
    ' * Released under the MIT license',
    ' * https://github.com/Mammut-FE/monaco-hive/blob/master/LICENSE.md',
    ' *-----------------------------------------------------------------------------*/',
    ''
].join('\n');

bundleOne('monaco.contribution');
bundleOne('hiveMode');
bundleOne('hiveWorker');

function bundleOne (moduleId, exclude) {
    requirejs.optimize({
        baseUrl: 'out/amd/',
        name: 'vs/language/hive/' + moduleId,
        out: 'release/dev/' + moduleId + '.js',
        exclude: exclude,
        paths: {
            'vs/language/hive': REPO_ROOT + '/out/amd'
        },
        optimize: 'none',
        packages: [
            {
                name: 'vscode-hive-languageservice',
                location: path.join(REPO_ROOT, 'services/index'),
                main: 'hiveLanguageService'
            }, {
                name: 'vscode-languageserver-types',
                location: path.join(REPO_ROOT, 'node_modules/vscode-languageserver-types/lib/umd'),
                main: 'main'
            }, {
                name: 'vscode-uri',
                location: path.join(REPO_ROOT, 'node_modules/vscode-uri/lib/umd'),
                main: 'index'
            }, {
                name: 'vscode-nls',
                location: path.join(REPO_ROOT, '/out/amd/fillers'),
                main: 'vscode-nls'
            }
        ]
    }, function () {
    });
}
