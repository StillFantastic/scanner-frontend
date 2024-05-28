'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
});

interface CodeEditorProps {
  code: string;
  language: string;
  options: any;
  highlightRange?: { startLine: number; endLine: number };
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  options,
  highlightRange,
}) => {
  const editorRef = useRef<any>(null);
  const decorationsCollectionRef = useRef<string[]>([]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      diagnosticCodesToIgnore: [6133, 7044, 7050],
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      noLib: true,
      allowNonTsExtensions: true,
    });
  };

  useEffect(() => {
    if (editorRef.current && highlightRange) {
      const editor = editorRef.current;
      const { startLine, endLine } = highlightRange;

      const newDecorations = [
        {
          range: new window.monaco.Range(startLine, 1, endLine, 1),
          options: { isWholeLine: true, className: 'myLineHighlight' },
        },
      ];

      decorationsCollectionRef.current = editor.deltaDecorations(
        decorationsCollectionRef.current,
        newDecorations,
      );
      editor.revealLineInCenter(startLine);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.deltaDecorations(
          decorationsCollectionRef.current,
          [],
        );
        decorationsCollectionRef.current = [];
      }
    };
  }, [highlightRange]);

  return (
    <MonacoEditor
      onMount={handleEditorDidMount}
      height="100%"
      language={language || 'javascript'}
      value={code}
      options={options}
    />
  );
};

export default CodeEditor;
