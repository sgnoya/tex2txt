import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('tex2txt.convertTexToTxt', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor found');
			return;
		}

		const document = editor.document;
		const text = document.getText();

		// Get configuration
		const config = vscode.workspace.getConfiguration('texToTxtConverter');

		// Content extraction environments
		const contentExtractionEnvironments: string[] = config.get('contentExtractionEnvironments') || [
			'document',
			'abstract',
			'title'
		];

		// Surroundings to remove (loaded from settings)
		const removableSurroundings: [string, string][] = config.get('removableSurroundings') || [
			["\\\\begin{comment}", "\\\\end{comment}"],
			["\\\\iffalse", "\\\\fi"],
			["\\\\if0", "\\\\fi"],
			["\\\\if\\s*0", "\\\\fi"]
		];


		//// Equations to be replaced with a placeholder
		const formulaPlaceholder: string = config.get('formulaPlaceholder') || '[FORMULA]';
		const formulaPatterns: string[] = config.get('formulaPatterns') || [
			'\\\\\\((.*?)\\\\\\)',    // \( ... \)
			'\\\\\\[.*?\\\\\\]',    // \[ ... \]
			'\\$\\$(.*?)\\$\\$', // $$ ... $$
			'\\$(.*?)\\$'       // $ ... $
		];

		// LaTeX commands to be replaced with a placeholder
		const latexCommandReplacements: Record<string, string> = config.get('latexCommandReplacements') || {
			cite: '[CITATION]',
			ref: '[REFERENCE]'
		};

		// Environments to be removed while keeping the caption
		const removableEnvironments: string[] = config.get('removableEnvironments') || ['figure', 'table'];
		// Commands to extract captions
		const captionCommands: string[] = config.get('captionCommands') || ['caption', "subcaption"];

		// Commands to extract content
		const contentExtractionCommands: string[] = config.get('contentExtractionCommands') || [
			'section',
			'subsection',
			'subsubsection'
		];

		// Remove comments
		let convertedText = text.replace(/%.*/gm, '');

		// Remove surroundings
		for (const [start, end] of removableSurroundings) {
			const regex = new RegExp(`${start}[\\s\\S]*?${end}`, 'g');
			convertedText = convertedText.replace(regex, '');
		}

		// Keep the content inside the environments (\begin{*} keep this \end{*})
		for (const environment of contentExtractionEnvironments) {
			const envRegex = new RegExp(`\\\\begin\\{${environment}\\}([\\s\\S]*?)\\\\end\\{${environment}\\}`, 'g');
			convertedText = convertedText.replace(envRegex, (match, content) => {
				return content.trim();
			});
		}

		// Replace formulas with a placeholder
		for (const pattern of formulaPatterns) {
			const regex = new RegExp(pattern, 'gs');
			convertedText = convertedText.replace(regex, formulaPlaceholder);
		}

		// Replace LaTeX commands with a placeholder
		for (const [command, replacement] of Object.entries(latexCommandReplacements)) {
			const regex_w_tilde = new RegExp(`~\\\\${command}\\{.*?\\}`, 'g'); // ~\command{...}
			convertedText = convertedText.replace(regex_w_tilde, replacement);

			const regex = new RegExp(`\\\\${command}\\{.*?\\}`, 'g'); // \command{...}
			convertedText = convertedText.replace(regex, replacement);
		}

		// Remove environments while keeping the captions from multiple captionCommands
		for (const environment of removableEnvironments) {
			const envRegex = new RegExp(`\\\\begin\\{${environment}\\}([\\s\\S]*?)\\\\end\\{${environment}\\}`, 'g');
			convertedText = convertedText.replace(envRegex, (match, content) => {
				let captions = '';
				for (const captionCommand of captionCommands) {
					const captionRegex = new RegExp(`\\\\${captionCommand}\\{(.*?)\\}`, 'g');
					let matchCaption;
					while ((matchCaption = captionRegex.exec(content)) !== null) {
						let captionText = matchCaption[1].trim();
						if (!captionText.endsWith('.')) {
							captionText += '.'; // Add a period
						}
						captions += captionText + '\n';
					}
				}
				return captions.trim();
			});
		}

		// Extract content from commands
		for (const command of contentExtractionCommands) {
			const commandRegex = new RegExp(`\\\\${command}\\{(.*?)\\}`, 'g'); // \command{...}
			convertedText = convertedText.replace(commandRegex, (match, content) => {
				let extractedContent = content.trim();
				if (!extractedContent.endsWith('.')) {
					extractedContent += '.'; // Add a period
				}
				return extractedContent;
			});

			const orgCommandRegex = new RegExp(`\\\\${command}`, 'g'); // \command{...}
			convertedText = convertedText.replace(orgCommandRegex, '');
		}

		// Open the converted text in a new editor
		const doc = await vscode.workspace.openTextDocument({ content: convertedText, language: 'plaintext' });
		vscode.window.showTextDocument(doc);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
