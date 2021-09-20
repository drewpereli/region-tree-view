import * as vscode from 'vscode';
import { basename } from 'path';
import Region from './region';

export class RegionsProvider implements vscode.TreeDataProvider<RegionTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<RegionTreeItem | undefined | void> = new vscode.EventEmitter<RegionTreeItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<RegionTreeItem | undefined | void> = this._onDidChangeTreeData.event;

  constructor() {    
    vscode.window.onDidChangeActiveTextEditor(() => this.refresh());
  }

  getTreeItem(element: RegionTreeItem): vscode.TreeItem {
		return element;
	}

  getChildren(element?: RegionTreeItem): Thenable<RegionTreeItem[]> {
		if (element) {
      // get children
      let region = element.region;

      let children = region.getChildRegions();

      let childItems = children.map(childRegion => new RegionTreeItem(childRegion));

      return Promise.resolve(childItems);
		} else {
			// Return current file name
      let activeDocument = vscode.window.activeTextEditor?.document; 
      
      if (!activeDocument) {
        return Promise.resolve([]);
      }

      let fileName = activeDocument.fileName;

      let baseName = basename(fileName);

      let text = activeDocument.getText();

      let region = new Region(text, baseName);

      let item = new RegionTreeItem(region);

      return Promise.resolve([item]);
		}

	}

  private refresh() {
    this._onDidChangeTreeData.fire();
  }
}

class RegionTreeItem extends vscode.TreeItem {
  constructor(
    region: Region,
  ) {
    let state = region.getChildRegions().length > 0 ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
		super(region.name, state);
    this.region = region;
  }

  public readonly region: Region;
}
