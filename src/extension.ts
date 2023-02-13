// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { RequestHandler } from 'express';
var express = require('express');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	startServer();
}

function showEditor(file: vscode.Uri) {
    return vscode.workspace.openTextDocument(file)
        .then(doc => {
        return vscode.window.showTextDocument(doc);
    });
}

 /**
  * GoTo Position in a file
  * @param file File to jump to
  * @param positionStart start of Position (line, char)
  * @param positionEnd optional end of selection (line,char). If not present no selection is done
  */
function gotoPosition(file: vscode.Uri, positionStart: vscode.Position, positionEnd?: vscode.Position){
	if(!positionEnd){
		positionEnd = new vscode.Position(positionStart.line, positionStart.character);
	}
    let sel = new vscode.Selection(positionStart, positionEnd);
	showEditor(file).then((editor)=>{
    	editor.selection = sel;
    	editor.revealRange(editor.selection, vscode.TextEditorRevealType.InCenter);
	});
}

 /**
  * GoTo Position in a file
  * @param file File to replace into
  * @param positionStart start of Position (line, char)
  * @param positionEnd end of selection (line,char).
  * @param text text to place into
  */
function replacePosition(file: vscode.Uri, positionStart: vscode.Position, positionEnd: vscode.Position, text: string){
	let sel = new vscode.Selection(positionStart, positionEnd);
	showEditor(file).then((editor)=>{
    	editor.selection = sel;
    	editor.revealRange(editor.selection, vscode.TextEditorRevealType.InCenter);
		editor.edit(builder => builder.replace(editor.selection, text));
	});
	
}

function gotoLine(file: vscode.Uri, line: number){
	gotoPosition(file, new vscode.Position(line - 1, 0));
}

function startServer(){
	const app = express();
	
	app.use(express.json());

	// Go to line
	app.post("/goto", gotoLineHandler);

	// Go to position
	app.post("/goto/position", gotoPositionHandler);

	// Select matching
	app.post("/goto/match", gotoMatchHandler);

	// Replace position
	app.post("/replace/position", replacePositionHandler);



	const PORT = process.env.API_PORT || 7331;
	app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
	});
}

export const gotoLineHandler: RequestHandler = (req, res) => {
	if(!req.body.file || !req.body.line){
		res.status(400).json({ error: "Failed due to missing parameters" });
		return;
	}
	let line = req.body.line;
	let file: vscode.Uri = vscode.Uri.parse("file:" + req.body.file);
	gotoLine(file, line);
	res.json({ success: "true" });
  };

export const gotoMatchHandler: RequestHandler = (req, res) => {
	if(!req.body.file || !req.body.match){
		res.status(400).json({ error: "Failed due to missing parameters" });
		return;
	}
	let line = req.body.line;
	let file: vscode.Uri = vscode.Uri.parse("file:" + req.body.file);
	gotoLine(file, line);
	res.json({ success: "true" });
};

  export const gotoPositionHandler: RequestHandler = (req, res) => {
	if(!req.body.file || !req.body.start || !req.body.end){
		res.status(400).json({ error: "Failed due to missing parameters" });
		return;
	}
	let start = new vscode.Position(req.body.start.line - 1, req.body.start.char ?? 0)
	let end = new vscode.Position(req.body.end.line - 1, req.body.end.char ?? 0)
	let file: vscode.Uri = vscode.Uri.parse("file:" + req.body.file);
	gotoPosition(file, start, end);
	res.json({ success: "true" });
  };

export const replacePositionHandler: RequestHandler = (req, res) => {
	if(!req.body.file || !req.body.start || !req.body.end || !req.body.text){
		res.status(400).json({ error: "Failed due to missing parameters" });
		return;
	}
	let start = new vscode.Position(req.body.start.line - 1, req.body.start.char ?? 0)
	let end = new vscode.Position(req.body.end.line - 1, req.body.end.char ?? 0)
	let text = req.body.text;
	let file: vscode.Uri = vscode.Uri.parse("file:" + req.body.file);
	replacePosition(file, start, end, text);
	res.json({ success: "true" });
};

export function deactivate() {}
