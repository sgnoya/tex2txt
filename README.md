# Tex2Txt README

A Visual Studio Code extension for converting a LaTeX `.tex` file into simplified plain text by removing unwanted content, replacing equations with placeholders, and extracting relevant content based on your custom settings.

## Features

- **Remove comments:** Deletes all LaTeX comments starting with `%`.
- **Replace equations with placeholders:** Inline (`\( ... \)`, `$ ... $`) and display math (`\[ ... \]`, `$$ ... $$`) equations are replaced with a configurable placeholder (default: `[FORMULA]`).
- **Extract specific content:** Retains content within specified LaTeX commands (e.g., `\section{}`, `\subsection{}`) and environments (e.g., `\begin{document} ... \end{document}`).
- **Remove blocks:** Deletes text within custom delimiters such as `\iffalse ... \fi`, `\if0 ... \fi`, or `\begin{comment} ... \end{comment}`.
- **Handle captions:** Retains captions (e.g., `\caption{...}`, `\subcaption{...}`) while removing the surrounding content (e.g., `\begin{figure}...\end{figure}`)
- **Open converted text:** Displays the converted text in a new editor without saving to a file.

## Usage

1. Open a LaTeX `.tex` file in VSCode.
2. Run the command `Tex2Txt: Convert tex to txt` from the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
3. The converted plain text will open in a new editor tab.

## Configuration

You can customize the behavior of the extension using the following settings in `settings.json`:

### Example Settings

```json
{
  "texToTxtConverter.removableSurroundings": [
    ["\\begin{comment}", "\\end{comment}"],
    ["\\iffalse", "\\fi"],
    ["\\if0", "\\fi"],
    ["\\if\\s*0", "\\fi"]
  ],
  "texToTxtConverter.contentExtractionEnvironments": [
    "document",
    "abstract",
    "itemize",
    "enumerate"
  ],
  "texToTxtConverter.formulaPlaceholder": "[FORMULA]",
  "texToTxtConverter.formulaPatterns": [
    "\\\\\\(.*?\\\\\\)",
    "\\\\\\[.*?\\\\\\]",
    "\$\$(.*?)\$\$",
    "\$(.*?)\$",
    "\\\\begin{equation}(.*?)\\\\end{equation}",
    "\\\\begin{equation\\*}(.*?)\\\\end{equation\\*}",
    "\\\\begin{align}(.*?)\\\\end{align}",
    "\\\\begin{align\\*}(.*?)\\\\end{align\\*}",
    "\\\\begin{eqnarray}(.*?)\\\\end{eqnarray}",
    "\\\\begin{eqnarray\\*}(.*?)\\\\end{eqnarray\\*}"
  ],
  "texToTxtConverter.latexCommandReplacements": {
    "cite": "[CITATION]",
    "ref": "[REFERENCE]",
    "label": "[LABEL]",
    "eqref": "[EQUATION]",
    "url": "[URL]"
  },
  "texToTxtConverter.removableEnvironments": [
    "figure",
    "table",
    "figure\\*",
    "table\\*"
  ],
  "texToTxtConverter.captionCommands": ["caption", "subcaption"],
  "texToTxtConverter.contentExtractionCommands": [
    "section",
    "subsection",
    "subsubsection",
    "footnote",
    "title",
    "bf",
    "it",
    "emph",
    "rm",
    "tt",
    "textbf",
    "textit",
    "texttt",
    "textrm",
    "noindent"
  ]
}
```

### Configuration Options

1. **`removableSurroundings`**:
   - Specify pairs of delimiters to remove their contents.
   - Example: `[["\\iffalse", "\\fi"]]` removes all content between `\iffalse` and `\fi`.

1. **`contentExtractionEnvironments`**:
   - Specify LaTeX environments whose content should be retained.
   - Example: `["document", "abstract", "itemize"]` extracts the content of `\begin{document} ... \end{document}`.

1. **`formulaPlaceholder`**:
   - Placeholder text to replace math equations.
   - Default: `[FORMULA]`.

1. **`formulaPatterns`**:
   - Regular expressions for detecting inline and display math equations, as well as advanced math environments.
   - Example: `\\\\\\(.*?\\\\\\)` matches `\( ... \)`.

1. **`latexCommandReplacements`**:
   - Specify LaTeX commands to replace with placeholders.
   - Example: `{ "cite": "[CITATION]" }` replaces `\cite{...}` with `[CITATION]`.

1. **`removableEnvironments`**:
   - Specify LaTeX environments to remove while retaining the content of their captions (e.g., `\caption{...}`).
   - Example: `["figure", "table", "figure\\*", "table\\*"]` removes the environment but retains captions within.

1. **`captionCommands`**:
   - Specify LaTeX commands whose content should be retained.
   - Example: `["caption", "subcaption"]` retains the content of `\caption{...}` and `\subcaption{...}`.

1. **`contentExtractionCommands`**:
   - Specify commands whose content should be retained without the command itself.
   - Example: `["section", "subsection", "title"]` retains the content of `\section{...}`.


## Example Workflow

### Input `.tex` File

```latex
\documentclass{article}
\begin{document}

% This is a comment
This content should remain.

\iffalse
This content should be removed.
\fi

\if 0
This content should also be removed.
\fi

\begin{comment}
This block should also be removed.
\end{comment}

\section{Introduction}
This is the introduction.

eq: $A formula$

a paper~\cite{hoge,fuga}

\begin{figure}
    \begin{minipage}
        \centering
        \includegraphics[width=0.5\textwidth]{example.png}
        \subcaption{This is a subcaption.}
    \end{minipage}
    \begin{minipage}
        \centering
        \includegraphics[width=0.5\textwidth]{example.png}
        \subcaption{This is a subcaption 2.}
    \end{minipage}
    \caption{This is a figure $hoge fuga eq$ caption}
    \label{fig:example}
    Some figure content that should be removed.
\end{figure}


\end{document}
```

### Output Text

```plaintext
\documentclass{article}
This content should remain.


Introduction.
This is the introduction.

eq: [FORMULA]

a paper[CITATION]

This is a figure [FORMULA] caption.
This is a subcaption.
This is a subcaption 2.
```

## Limitations

- **Nested Delimiters**: Currently, the extension does not support nested delimiters (e.g., `\iffalse ... \iffalse ... \fi \fi`).
- **Advanced Commands**: Custom LaTeX commands not included in the settings may not be processed correctly.

## Contributing

Contributions are welcome! If you encounter any issues or have feature requests, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.


## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release.

**Enjoy!**
