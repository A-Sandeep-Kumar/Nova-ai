import React from 'react';
import { Sliders, Cpu, Coins, Sparkles, Palette, Trash2, ShieldAlert, BarChart2 } from 'lucide-react';

export default function Sidebar({
  model,
  setModel,
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  systemPrompt,
  setSystemPrompt,
  metrics,
  theme,
  setTheme,
  onClearChat,
  activePanel,
  setActivePanel
}) {
  const themes = [
    { id: 'nebula', name: 'Nebula Space', color: '#8b5cf6' },
    { id: 'cyberpunk', name: 'Cyberpunk', color: '#00f2fe' },
    { id: 'polaris', name: 'Polaris green', color: '#10b981' },
    { id: 'matrix', name: 'Matrix Digital', color: '#00ff46' }
  ];

  return (
    <aside className="glass-panel sidebar" style={{ display: 'flex', flexDirection: 'column', width: '320px', height: '100%', padding: '1.25rem', gap: '1.25rem', overflowY: 'auto', borderRight: '1px solid var(--border-glow)' }}>
      {/* Header / Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="pulse-glow-element" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--glow-intensity)' }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '0.05em', background: 'linear-gradient(90deg, var(--accent-color), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NOVA AI</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>V2026.AGENTIC</span>
        </div>
      </div>

      {/* Model Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Cpu size={14} /> AI Model Engine
        </label>
        <select 
          value={model} 
          onChange={(e) => setModel(e.target.value)}
          className="glow-input" 
          style={{ width: '100%', padding: '0.5rem 0.75rem', cursor: 'pointer', background: 'var(--bg-primary)' }}
        >
          <option value="Nova-1.0-Flash">Nova 1.0 Flash (Fast & Lean)</option>
          <option value="Nova-1.5-Pro">Nova 1.5 Pro (Multimodal Core)</option>
          <option value="Nova-Reasoning">Nova-Reasoning (Deep CoT)</option>
        </select>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {model === 'Nova-1.0-Flash' && '⚡ Sub-second response, perfect for simple logic.'}
          {model === 'Nova-1.5-Pro' && '🧠 High intelligence, reasoning & artifact capabilities.'}
          {model === 'Nova-Reasoning' && '⏳ Simulates multi-turn self-correction logic chains.'}
        </span>
      </div>

      {/* Parameter Settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Sliders size={14} /> Hyperparameters
        </div>

        {/* Temperature */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span>Temperature:</span>
            <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>{temperature.toFixed(1)}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={temperature} 
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-color)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            <span>Deterministic</span>
            <span>Creative</span>
          </div>
        </div>

        {/* Max Tokens */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span>Max Outputs:</span>
            <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>{maxTokens} tk</span>
          </div>
          <input 
            type="range" 
            min="256" 
            max="4096" 
            step="256" 
            value={maxTokens} 
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-color)', cursor: 'pointer' }}
          />
        </div>

        {/* System Prompt */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ fontSize: '0.8rem' }}>System Instructions:</div>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="glow-input"
            rows="2"
            style={{ resize: 'none', fontSize: '0.8rem', padding: '0.4rem', fontFamily: 'inherit', background: 'var(--bg-primary)' }}
            placeholder="System system prompt rules..."
          />
        </div>
      </div>

      {/* Toggle Layout Panels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <BarChart2 size={14} /> Interactive Workspace
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
          <button 
            className={`glow-btn ${activePanel === 'workspace' ? '' : 'inactive-panel-btn'}`}
            onClick={() => setActivePanel('workspace')}
            style={{
              padding: '0.4rem',
              fontSize: '0.8rem',
              justifyContent: 'center',
              background: activePanel === 'workspace' ? 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))' : 'rgba(255, 255, 255, 0.03)',
              border: activePanel === 'workspace' ? 'none' : '1px solid var(--border-glow)',
              opacity: activePanel === 'workspace' ? 1 : 0.7
            }}
          >
            Live App Runner
          </button>
          <button 
            className={`glow-btn ${activePanel === 'memory' ? '' : 'inactive-panel-btn'}`}
            onClick={() => setActivePanel('memory')}
            style={{
              padding: '0.4rem',
              fontSize: '0.8rem',
              justifyContent: 'center',
              background: activePanel === 'memory' ? 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))' : 'rgba(255, 255, 255, 0.03)',
              border: activePanel === 'memory' ? 'none' : '1px solid var(--border-glow)',
              opacity: activePanel === 'memory' ? 1 : 0.7
            }}
          >
            Graph RAG Map
          </button>
        </div>
      </div>

      {/* Metrics HUD */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.75rem', fontSize: '0.8rem', border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600', color: 'var(--accent-color)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
          <Coins size={12} /> Performance HUD Metrics
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Latency (avg):</span>
          <span style={{ fontWeight: '500' }}>{metrics.latency} ms</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Input Tokens:</span>
          <span style={{ fontWeight: '500' }}>{metrics.inputTokens}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Output Tokens:</span>
          <span style={{ fontWeight: '500' }}>{metrics.outputTokens}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.25rem', marginTop: '0.25rem' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Simulated Cost:</span>
          <span style={{ color: '#10b981', fontWeight: '700' }}>${metrics.cost.toFixed(6)}</span>
        </div>
      </div>

      {/* Theme Picker */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Palette size={14} /> Neural Interface Themes
        </label>
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'space-between' }}>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              title={t.name}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: t.color,
                border: theme === t.id ? '2px solid #ffffff' : '2px solid transparent',
                cursor: 'pointer',
                boxShadow: theme === t.id ? `0 0 10px ${t.color}` : 'none',
                transition: 'all 0.2s',
                display: 'inline-block'
              }}
            />
          ))}
        </div>
      </div>

      {/* Clear Button */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <button
          onClick={onClearChat}
          className="glow-btn"
          style={{
            width: '100%',
            justifyContent: 'center',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            padding: '0.5rem',
            fontSize: '0.85rem'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.25)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
        >
          <Trash2 size={14} /> Clear Workspace
        </button>
      </div>
    </aside>
  );
}
