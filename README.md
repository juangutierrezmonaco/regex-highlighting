# Regex Highlighting

An extension that colorizes text based on a regular expression.

## Installation

To install the extension, follow these steps:

1. Clone the repository.
2. Run `yarn` to install the dependencies.
3. Run `yarn package` to generate the VSIX package.
4. In VS Code, open the Extensions view and click on the ellipsis menu (`...`), then click on "Install from VSIX..." and select the generated package.

## Usage

To use the extension, open a file and click on the `$(regex) Regex Highlighting` button in the status bar. This will open a menu with the following options:

- Activate: Activates the extension and highlights all occurrences of the default regular expression (`/TODO:/gi`).
- Deactivate: Deactivates the extension and removes all highlights.
- Set Personalized Regex: Allows you to set a personalized regular expression to highlight. You will be prompted to enter the regular expression, and you can choose whether to make it case-sensitive or not.
- Restore To Default: Sets the regular expression back to the default value (`/TODO:/gi`).
- Copy Texts: Copies all highlighted texts to the clipboard.

## Default Parameters

The default regular expression is `/TODO:/gi`, which matches all occurrences of the string "TODO" (case-insensitive) in the text.

## License

This extension is licensed under the [MIT License](LICENSE).
