import {workspace, window, languages, ExtensionContext, TextDocument, DocumentSelector, Position, commands, LanguageConfiguration, CompletionItemKind, CompletionItem, SnippetString, CompletionItemProvider, Hover, HoverProvider, Disposable, CancellationToken} from 'vscode';
// import util = require('util');
// import child_process = require("child_process");

const fipsLangDefinitions = {
    fips_setup: {
        type: "macro",
        desc: `
### fips_setup()

Initializes the fips build system in a cmake file hierarchy. Must be called once in the root CMakeLists.txt before any other fips cmake macros.

You *must* call the cmake command ‘project([proj_name])’ before fips_setup() to define a project name. Starting with version 3.15, cmake will issue a warning if the toplevel CMakeLists.txt file doesn’t contain a verbatim project() statement.
        `
    },
    fips_finish: {
        type: "macro",
        desc: `
### fips_finish()

Must be called in the root CMakeLists.txt file after any other fips macros and does any work that must happen once after each cmake run. Currently this is macro does nothing.
        `
    },
    fips_project: {
        type: "macro",
        desc: `
### fips_project()

Starts a new project with the given name. This must be called at least once in a hierarchy of CMakeLists.txt files, usually right after fips_setup().

Use the fips_project() macro instead of cmake’s builtin project() macro
        `
    },
};

export function activate(disposables) {
    languages.registerHoverProvider('cmake', {
        provideHover(document, position, token) {
            let range = document.getWordRangeAtPosition(position);
            let value = document.getText(range);
            let returnVal = null;
            Object.keys(fipsLangDefinitions).forEach(key => {
                if (value === key)
                {
                    returnVal = fipsLangDefinitions[key]["desc"];
                    return;
                }
            });
            
            if (returnVal != null)
            {
                const hover = new Hover({ language: 'md', value: returnVal});
                return hover;
            }

            return null;
        }
    });
};