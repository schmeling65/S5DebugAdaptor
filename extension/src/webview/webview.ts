import * as vscode from 'vscode'
import { S5DebugAdapterDescriptorFactory } from '../debugadaptor/debugadaptor';

type vsCodeDisposable = vscode.Disposable | undefined

interface messageContent {
    type: string,
    value: boolean,
}

export class MySidebarProvider implements vscode.WebviewViewProvider {
    private isCheckboxChecked = false;
    private persistentStorageKeyName = "IsS5LuaDebuggerActive"
    private registerdDebugAdapterDescriptorFactory: vsCodeDisposable =  undefined
    private S5DebugAdapterDescriptorFactoryDisposable: S5DebugAdapterDescriptorFactory
    constructor(private readonly extensionContext: vscode.ExtensionContext,) {
        let checkboxChecked: boolean = this.extensionContext.globalState.get(this.persistentStorageKeyName)!;
        this.isCheckboxChecked = checkboxChecked
        this.S5DebugAdapterDescriptorFactoryDisposable = new S5DebugAdapterDescriptorFactory()
    }

    public async resolveWebviewView( webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken) {
        webviewView.webview.options = { enableScripts: true, localResourceRoots: [this.extensionContext.extensionUri] };
        webviewView.webview.html = await this.getHtmlForWebview(webviewView.webview);
        if (this.isCheckboxChecked) {
            webviewView.webview.postMessage({
                command:"setCheckboxToTrue",
                value:this.isCheckboxChecked
            })
            this.activateOrStopGameSearch(this.isCheckboxChecked)
        }
        webviewView.webview.onDidReceiveMessage(async (message: messageContent) => {
            switch (message.type) {
                case 'toggleChanged': {
                    await this.extensionContext.globalState.update(this.persistentStorageKeyName, message.value);
                     this.activateOrStopGameSearch(message.value)
                    break;
                }
            }
        });
    }

    private activateOrStopGameSearch(status: boolean) {
        if (status) {
            this.registerdDebugAdapterDescriptorFactory = vscode.debug.registerDebugAdapterDescriptorFactory('s5lua', this.S5DebugAdapterDescriptorFactoryDisposable)
            this.extensionContext.subscriptions.push(this.registerdDebugAdapterDescriptorFactory);
            this.S5DebugAdapterDescriptorFactoryDisposable.searchForGame()
        }
        else {
            this.S5DebugAdapterDescriptorFactoryDisposable.stopSearchForGame()
            this.registerdDebugAdapterDescriptorFactory!.dispose()
            this.registerdDebugAdapterDescriptorFactory = undefined
        }
    }

    private async getHtmlForWebview(webview: vscode.Webview) {
        const extensionUri = this.extensionContext.extensionUri
        const rawdata = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(extensionUri,"out","htmlwebview","index.html"))
        const htmlstring = new TextDecoder("utf-8").decode(rawdata)
        return htmlstring
    }
}