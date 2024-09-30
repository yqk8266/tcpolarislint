const vscode = require('vscode');

function getCurrentVueFileContent() {
	const editor = vscode.window.activeTextEditor;
	if (editor && editor.document.languageId === 'vue') {
		return editor.document.getText();
	}
	return null;
}

function matchClassNames(content) {
	const classNames = [];
	const regex = /\sclass="([^"]+)"/g;
	let match;
	while ((match = regex.exec(content))!== null) {
		const classes = match[1].split(' ');
		classes.forEach(className => {
			if (className.trim()!== '' &&!classNames.includes(className)) {
				classNames.push(className);
			}
		});
	}
	console.log('当前是', classNames)
	return classNames;
}

function highlightClassNames() {
	const content = getCurrentVueFileContent();
	if (content) {
		const classNames = matchClassNames(content);
		classNames.forEach(className => {
			const decoration = vscode.window.createTextEditorDecorationType({
				textDecoration: 'underline dashed #808080',
			});
			const regex = new RegExp(`${className}`, 'g');
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const matches = editor.document.getText().matchAll(regex);
				const ranges = [];
				for (const match of matches) {
					ranges.push(new vscode.Range(editor.document.positionAt(match.index), editor.document.positionAt(match.index + match[0].length)));
				}
				editor.setDecorations(decoration, ranges);
			}
		});
	}
}

exports.activate = function(context) {
	const disposable = vscode.commands.registerCommand('extension.highlightClassNames', highlightClassNames);
	context.subscriptions.push(disposable);
};

exports.deactivate = function() {};