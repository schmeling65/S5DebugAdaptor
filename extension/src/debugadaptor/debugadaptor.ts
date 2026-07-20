import * as vscode from 'vscode'
import { checkProcess } from './findprocess';

type timeoutTrigger = NodeJS.Timeout | undefined

export class S5DebugAdapterDescriptorFactory implements vscode.DebugAdapterDescriptorFactory {
	private searchIntervall: timeoutTrigger = undefined
	constructor() {
	}
	public async createDebugAdapterDescriptor(session: vscode.DebugSession, executable: vscode.DebugAdapterExecutable | undefined): Promise<vscode.ProviderResult<vscode.DebugAdapterDescriptor>> {
		let conf = session.configuration;
		
		/*
		if (conf.request === "launch" && conf.program) {
			let del = 1;
			if (conf.attachDelay) {
				del = conf.attachDelay;
			}
			spawn(conf.program, conf.args);
			await this.sleep(del * 1000);
		}
		*/

		return new vscode.DebugAdapterServer(19021);
	}

	public searchForGame() {
		this.searchIntervall =  setInterval( async () =>{
			if (await checkProcess("settlershok.exe")) {
				
			}
		},2000)
	}

	public stopSearchForGame() {
		console.log("Suchintervall beendet")
		clearInterval(this.searchIntervall)
		this.searchIntervall = undefined
	}
}