import * as vscode from 'vscode';
import getLineAndColumnFromIndex from './get-line-and-column-from-index';
import { RegionsProvider as RegionTreeProvider } from './region-tree-provider';

export function activate(context: vscode.ExtensionContext) {
	let treeView = vscode.window.createTreeView('regions', {
		treeDataProvider: new RegionTreeProvider()
	});

	treeView.onDidChangeSelection(e => {
		let region = e.selection[0].region;

		let editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		let offsetInfo = getLineAndColumnFromIndex(editor.document.getText(), region.startIndex);

		if (offsetInfo === null) {
			return;
		}

		let {line, column} = offsetInfo;
		
		let startPosition = new vscode.Position(line, column);
		let endPosition = new vscode.Position(line + 1, column);

		let range = new vscode.Range(startPosition, endPosition);

		editor.revealRange(range, vscode.TextEditorRevealType.AtTop);
	});
}
