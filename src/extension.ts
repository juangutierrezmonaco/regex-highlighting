import * as vscode from "vscode";
import {
  activateRegexHighlighting,
  deactivateRegexHighlighting,
  setPersonalizedRegex,
  restoreDefault,
  copyTexts,
} from "./commands";

export function activate(context: vscode.ExtensionContext) {
  const regexHighlightingButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  regexHighlightingButton.text = "$(regex) Regex Highlighting";
  regexHighlightingButton.command = "regexHighlighting.openMenu";
  regexHighlightingButton.show();

  context.subscriptions.push(
    vscode.commands.registerCommand("regexHighlighting.openMenu", () => {
      const regexHighlightingSubMenu = vscode.window.createQuickPick();
      regexHighlightingSubMenu.items = [
        { label: "Activate" },
        { label: "Deactivate" },
        { label: "Set Personalized Regex" },
        { label: "Restore To Default" },
        { label: "Copy Texts" },
      ];
      regexHighlightingSubMenu.canSelectMany = false;
      regexHighlightingSubMenu.onDidChangeSelection(([selectedItem]) => {
        switch (selectedItem.label) {
          case "Activate":
            activateRegexHighlighting();
            break;
          case "Deactivate":
            deactivateRegexHighlighting();
            break;
          case "Set Personalized Regex":
            setPersonalizedRegex();
            break;
          case "Restore To Default":
            restoreDefault();
            break;
          case "Copy Texts":
            copyTexts();
            break;
        }
        regexHighlightingSubMenu.hide();
      });
      regexHighlightingSubMenu.onDidHide(() => {
        regexHighlightingSubMenu.dispose();
      });
      regexHighlightingSubMenu.show();
    })
  );
}

export function deactivate() {}
