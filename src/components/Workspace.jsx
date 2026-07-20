import React, { useState, useEffect } from 'react';
import { Play, Code, Eye, Copy, Download, RefreshCw, FileCode, Check } from 'lucide-react';

export default function Workspace({ artifact, onCodeChange }) {
  const [activeTab, setActiveTab] = useState('preview'); // 'code' or 'preview'
  const [editorContent, setEditorContent] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (artifact) {
      setEditorContent(artifact.code);
      // Default to preview for interactive files, code for SVG
      if (artifact.language === 'svg') {
        setActiveTab('code');
      } else {
        setActiveTab('preview');
      }
    }
  }, [artifact]);

  if (!artifact) {
    return (
      <div className="glass-panel" style={{ flex: 1.2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', padding: '2rem', textAlign: 'center', minWidth: '360px' }}>
        <FileCode size={48} style={{ color: 'var(--border-glow)', marginBottom: '1rem' }} />
        <h3>Workspace Active Sandbox</h3>
        <p style={{ fontSize: '0.85rem', maxWidth: '300px', marginTop: '0.5rem' }}>
          When the AI generates coding files, prototypes, or SVG drawings, they will instantly compile here as active artifacts.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(editorContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([editorContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = artifact.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTextChange = (e) => {
    const newCode = e.target.value;
    setEditorContent(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  // Prepares the source document for the sandboxed preview iframe
  const getIframeSrcDoc = () => {
    if (artifact.language === 'svg') {
      // SVGs need a light container to be rendered inside an iframe
      return `<!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0c0f1d; }
          svg { max-width: 90%; max-height: 90%; }
        </style>
      </head>
      <body>
        ${editorContent}
      </body>
      </html>`;
    }
    return editorContent;
  };

  return (
    <div className="glass-panel workspace-panel" style={{ flex: 1.2, height: '100%', display: 'flex', flexDirection: 'column', minWidth: '360px', overflow: 'hidden' }}>
      {/* Workspace Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileCode size={16} style={{ color: 'var(--accent-color)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{artifact.filename}</span>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', background: 'var(--bg-tertiary)', color: 'var(--accent-color)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-glow)' }}>
            {artifact.language}
          </span>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.03)', padding: '0.2rem', borderRadius: '6px' }}>
          <button
            onClick={() => setActiveTab('preview')}
            style={{
              padding: '0.3rem 0.6rem',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: activeTab === 'preview' ? 'var(--accent-color)' : 'transparent',
              color: activeTab === 'preview' ? '#fff' : 'var(--text-muted)',
              fontWeight: '500'
            }}
          >
            <Eye size={12} /> Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            style={{
              padding: '0.3rem 0.6rem',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: activeTab === 'code' ? 'var(--accent-color)' : 'transparent',
              color: activeTab === 'code' ? '#fff' : 'var(--text-muted)',
              fontWeight: '500'
            }}
          >
            <Code size={12} /> Editor Code
          </button>
        </div>
      </header>

      {/* Editor & Preview Workspace Container */}
      <div style={{ flex: 1, position: 'relative', background: '#0b0f19' }}>
        {activeTab === 'code' ? (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <textarea
              value={editorContent}
              onChange={handleTextChange}
              style={{
                width: '100%',
                height: '100%',
                background: '#040711',
                color: '#8be9fd',
                border: 'none',
                padding: '1.25rem',
                fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                fontSize: '0.85rem',
                lineHeight: '1.6',
                resize: 'none',
                outline: 'none',
                colorScheme: 'dark'
              }}
            />
            {/* Live edit badge */}
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', fontSize: '0.65rem', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.5rem', borderRadius: '4px', pointerEvents: 'none' }}>
              <RefreshCw size={10} className="pulse-glow-element" /> Live Sandbox Sandbox
            </div>
          </div>
        ) : (
          <iframe
            srcDoc={getIframeSrcDoc()}
            sandbox="allow-scripts"
            title="Artifact Preview Sandbox"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: '#ffffff'
            }}
          />
        )}
      </div>

      {/* Footer Controls */}
      <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.1)', borderTop: '1px solid var(--border-glow)' }}>
        <button
          onClick={handleCopy}
          className="glow-btn"
          style={{
            padding: '0.35rem 0.75rem',
            fontSize: '0.75rem',
            background: copied ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${copied ? '#10b981' : 'var(--border-glow)'}`,
            color: copied ? '#10b981' : 'var(--text-main)'
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied!' : 'Copy Code'}
        </button>
        <button
          onClick={handleDownload}
          className="glow-btn"
          style={{
            padding: '0.35rem 0.75rem',
            fontSize: '0.75rem',
            background: 'var(--accent-color)'
          }}
        >
          <Download size={12} /> Download file
        </button>
      </footer>
    </div>
  );
}
