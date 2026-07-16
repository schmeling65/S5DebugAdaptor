import * as vscode from 'vscode'

type activString = ["activated", "deactivated"]

export class MySidebarProvider implements vscode.WebviewViewProvider {
    constructor(private readonly extensionContext: vscode.ExtensionContext,) {}

    public async resolveWebviewView( webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken) {
        webviewView.webview.options = { enableScripts: true, localResourceRoots: [this.extensionContext.extensionUri] };
        webviewView.webview.html = await this.getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'toggleChanged': {
                    const status = data.value ? 'aktiviert' : 'deaktiviert';
                    vscode.window.showInformationMessage(`Feature ist jetzt ${status}!`);
                    this.activateOrStopGameSearch(status)
                    break;
                }
            }
        });

    }

    private activateOrStopGameSearch(status: string) {
        if (status === "aktiviert") {

        }
        else if  (status === "deaktiviert") {

        }
        else {
            throw new Error("Falscher Zustand!")
        }
    }

    private async getHtmlForWebview(webview: vscode.Webview) {
        const extensionUri = this.extensionContext.extensionUri
        const rawdata = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(extensionUri,"out","htmlwebview","index.html"))
        const htmlstring = new TextDecoder("utf-8").decode(rawdata)
        return htmlstring
    }
}