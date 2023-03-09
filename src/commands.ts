import * as vscode from "vscode";
import { DecorationType, RegexObject } from "./types";

let decorationType: DecorationType;
let originalRegexes: RegexObject[] = [
  { pattern: /(?<=")\s*(.*?)\s*(?=")/g, files: [".ts", ".js"] },
  { pattern: />hola</g, files: [".html"] },
];
let currentRegexes: RegexObject[] = originalRegexes;
let activeEditor: vscode.TextEditor = vscode.window.activeTextEditor;
let intervalId: NodeJS.Timeout;

function triggerUpdateDecorations() {
  if (!activeEditor) {
    return;
  }
  const text = activeEditor.document.getText();
  const decorations: vscode.DecorationOptions[] = [];
  let match;
  currentRegexes.forEach(({ pattern, files }) => {
    if (files.some((file) => (activeEditor.document.fileName.endsWith(file)) || file === "*")) {
      while ((match = pattern.exec(text))) {
        const startPos = activeEditor.document.positionAt(match.index);
        const endPos = activeEditor.document.positionAt(
          match.index + match[0].length
        );
        const decoration = {
          range: new vscode.Range(startPos, endPos),
          hoverMessage: "Matched Regex",
        };
        decorations.push(decoration);
      }
      pattern.lastIndex = 0;
    }
  });
  activeEditor.setDecorations(decorationType, decorations);
}

export function activateRegexHighlighting(): vscode.Disposable {
  if (!decorationType) {
    decorationType = vscode.window.createTextEditorDecorationType({
      backgroundColor: "rgba(255, 204, 0, .8)",
      borderWidth: "1px",
      borderColor: "#007acc",
      color: "white",
    });
  }
  activeEditor = vscode.window.activeTextEditor;

  if (activeEditor) {
    intervalId = setInterval(triggerUpdateDecorations, 500); // Call the function every 500ms
  }

  return vscode.window.onDidChangeActiveTextEditor((editor) => {
    activeEditor = editor;
    if (editor) {
      clearInterval(intervalId); // Clear the interval when the active editor changes
      setInterval(triggerUpdateDecorations, 500); // Call the function every 500ms with the new active editor
    }
  });
}

export function deactivateRegexHighlighting() {
  clearInterval(intervalId);
  if (activeEditor) {
    activeEditor.setDecorations(decorationType, []);
  }
}

export function setPersonalizedRegex() {
  const options: vscode.InputBoxOptions = {
    prompt: "Enter a regular expression:",
  };

  vscode.window.showInputBox(options).then((value) => {
    if (value !== undefined) {
      try {
        currentRegexes = [{ pattern: new RegExp(value, "g"), files: ["*"] }];
        activateRegexHighlighting();
      } catch (error) {
        vscode.window.showErrorMessage(`Invalid regular expression: ${error}`);
      }
    }
  });
}

export function restoreDefault() {
  currentRegexes = [...originalRegexes];
  deactivateRegexHighlighting();
}

export function copyTexts() {
  if (!activeEditor) {
    vscode.window.showInformationMessage("Open a file first to copy text!");
    return;
  }

  const text = activeEditor.document.getText();
  let newText = "";

  let match;
  currentRegexes.forEach(({ pattern, files }) => {
    if (files.some((file) => (activeEditor.document.fileName.endsWith(file)) || file === "*")) {
      while ((match = pattern.exec(text))) {
        newText += match[0] + "\n";
      }
      pattern.lastIndex = 0;
    }
  });

  vscode.env.clipboard.writeText(newText);
  vscode.window.showInformationMessage("Text copied to clipboard!");
}
