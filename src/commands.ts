import * as vscode from "vscode";
import { DecorationType } from "./types";

let decorationType: DecorationType;
let originalRegex: RegExp = /(?<=")\s*(.*?)\s*(?=")/g;
let currentRegex: RegExp = originalRegex;
let activeEditor: vscode.TextEditor = vscode.window.activeTextEditor;
let intervalId: NodeJS.Timeout;

function triggerUpdateDecorations() {
  if (!activeEditor) {
    return;
  }
  const text = activeEditor.document.getText();
  const decorations: vscode.DecorationOptions[] = [];
  let match;
  while ((match = currentRegex.exec(text))) {
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
        currentRegex = new RegExp(value, "g");
        activateRegexHighlighting();
      } catch (error) {
        vscode.window.showErrorMessage(`Invalid regular expression: ${error}`);
      }
    }
  });
}

export function restoreDefault() {
  currentRegex = originalRegex;
  deactivateRegexHighlighting();
}

export function copyTexts() {
  if (!activeEditor) {
    return;
  }
  const text = activeEditor.document.getText();
  let selectedText = "";
  let match;
  while ((match = currentRegex.exec(text))) {
    const startPos = activeEditor.document.positionAt(match.index);
    const endPos = activeEditor.document.positionAt(
      match.index + match[0].length
    );
    const selection = new vscode.Selection(startPos, endPos);
    selectedText += activeEditor.document.getText(selection) + "\n";
  }

  vscode.env.clipboard.writeText(selectedText.trim()).then(() => {
    vscode.window.showInformationMessage(
      "Selected text has been copied to clipboard!"
    );
    vscode.commands.executeCommand("workbench.action.files.revert");
  });
}
