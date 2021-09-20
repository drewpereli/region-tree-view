import * as vscode from 'vscode';
import { RegionsProvider } from './regions';

export function activate(context: vscode.ExtensionContext) {
	const regionsProvider = new RegionsProvider();
	vscode.window.registerTreeDataProvider('regions', regionsProvider);
}
