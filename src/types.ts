import * as vscode from "vscode";

export type DecorationType = vscode.TextEditorDecorationType;

export interface RegexObject {
  pattern: RegExp;
  files: string[];
}
