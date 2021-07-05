const vscode = require('vscode');
const Translator = require('./translator');
const tagModule = require("./tag.js");

//<div style="width: 100px; height: 100px;" name = "dont delete me"></div>

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, your extension "css-to-tailwind" is now active!');


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	let getCSS = vscode.commands.registerCommand("css-to-tailwind.convert", function () {

		//gets currently highlighted text
		const selected = vscode.window.activeTextEditor.selection;
		const range = new vscode.Range(selected.start, selected.end);
		let selectedText = vscode.window.activeTextEditor.document.getText(range);

		let x = new tagModule.Tag(selectedText);
		

		let edited = Translator.translate(x); //This should be the new tag
		vscode.window.activeTextEditor.edit(editBuilder =>{
			editBuilder.replace(selected, edited);
		});
	
	});

	context.subscriptions.push(getCSS);
}


// this method is called when your extension is deactivated
function deactivate() {
	vscode.window.showInformationMessage("CSS-to-Tailwind has been disabled.")
}

module.exports = {
	activate,
	deactivate
}
