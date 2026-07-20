import React, { useState } from 'react';
import { Sparkles, Wand2, Info, Check, HelpCircle, Activity } from 'lucide-react';
import { optimizePrompt } from '../services/mockAI';

export default function PromptLab({ temperature, maxTokens }) {
  const [rawPrompt, setRawPrompt] = useState('');
  const [optimizedOutput, setOptimizedOutput] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate SVG path for a Gaussian curve representing temperature entropy
  const getGaussianPath = () => {
    const width = 400;
    const height = 150;
    
    // Mean of curve is centered
    const mean = width / 2;
    
    // Standard deviation spreads with temperature (0.1 to 1.0)
    // Low temp = narrow bell curve. High temp = flat and wide.
    const stdDev = 15 + (temperature * 90);
    
    // Amplitude reduces as curve spreads (integral remains constant-ish)
    const amplitude = 130 - (temperature * 75);

    let points = [];
    for (let x = 0; x <= width; x += 2) {
      // Gaussian function: y = a * exp( - (x - b)^2 / (2 * c^2) )
      const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
      const y = height - (amplitude * Math.exp(exponent));
      points.push(`${x},${y}`);
    }

    return `M 0,${height} L ` + points.join(' L ') + ` L ${width},${height} Z`;
  };

  const handleOptimize = (e) => {
    e.preventDefault();
    if (!rawPrompt.trim()) return;

    setOptimizing(true);
    setTimeout(() => {
      const result = optimizePrompt(rawPrompt);
      setOptimizedOutput(result);
      setOptimizing(false);
    }, 800); // simulate pipeline delay
  };

  const handleCopy = () => {
    if (!optimizedOutput) return;
    navigator.clipboard.writeText(optimizedOutput.optimized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel" style={{ flex: 1.2, height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto', minWidth: '360px', padding: '1rem', gap: '1.25rem' }}>
      
      {/* Parameter Distribution visualization */}
      <div className="glass-card" style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border-glow)' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-color)', textTransform: 'uppercase' }}>
          <Activity size={14} /> Token Selection Entropy
        </h3>
        
        {/* Gaussian SVG Graph */}
        <div style={{ background: '#02040a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.5rem 0', position: 'relative' }}>
          <svg viewBox="0 0 400 160" width="100%" height="100%">
            <defs>
              <linearGradient id="curveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="var(--accent-color)" stop-opacity="0.8" />
                <stop offset="100%" stop-color="var(--accent-color)" stop-opacity="0.05" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            <line x1="200" y1="10" x2="200" y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(255,255,255,0.2)" />
            
            {/* Probability curve */}
            <path
              d={getGaussianPath()}
              fill="url(#curveGrad)"
              stroke="var(--accent-color)"
              strokeWidth="2.5"
              style={{ transition: 'd 0.3s ease' }}
            />
            
            {/* Legend Markers */}
            <text x="20" y="140" fill="var(--text-muted)" fontSize="8">Least Common Words</text>
            <text x="200" y="140" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">Highest Probability Word</text>
            <text x="380" y="140" textAnchor="end" fill="var(--text-muted)" fontSize="8">Least Common Words</text>
          </svg>
        </div>

        {/* Explain the math to the recruiter */}
        <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>
          <Info size={18} style={{ color: 'var(--accent-color)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>ML Entropy:</strong> At temperature <strong style={{ color: 'var(--accent-color)' }}>{temperature.toFixed(1)}</strong>, the Softmax probability distribution curves above. Lower values concentrate probability into a single token (narrow peak), while higher temperature flattens logits, increasing probability for less frequent words (wider span).
          </div>
        </div>
      </div>

      {/* Prompt engineering lab compiler */}
      <div className="glass-card" style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid var(--border-glow)' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-color)', textTransform: 'uppercase' }}>
          <Wand2 size={14} /> Prompt Compilation Lab
        </h3>

        <form onSubmit={handleOptimize} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '600' }}>Raw Prompt Input:</label>
          <textarea
            value={rawPrompt}
            onChange={(e) => setRawPrompt(e.target.value)}
            className="glow-input"
            rows="3"
            placeholder="Type a basic prompt (e.g. 'write a javascript countdown timer')..."
            style={{ fontSize: '0.8rem', resize: 'none', background: 'var(--bg-primary)' }}
          />
          <button
            type="submit"
            className="glow-btn"
            disabled={optimizing || !rawPrompt.trim()}
            style={{ alignSelf: 'flex-end', padding: '0.4rem 1rem', fontSize: '0.8rem' }}
          >
            <Sparkles size={12} /> {optimizing ? 'Running Compiler Pipeline...' : 'Compile & Optimize'}
          </button>
        </form>

        {optimizedOutput && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.75rem' }}>
            
            {/* Split View */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--accent-color)' }}>Optimized Structured Prompt:</span>
                <button
                  onClick={handleCopy}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glow)', padding: '0.2rem 0.5rem', fontSize: '0.7rem', color: copied ? '#10b981' : '#fff', cursor: 'pointer', borderRadius: '4px' }}
                >
                  {copied ? <Check size={10} style={{ display: 'inline', marginRight: '2px' }} /> : null}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre style={{
                background: '#040711',
                padding: '0.75rem',
                borderRadius: '6px',
                color: '#e2e8f0',
                fontSize: '0.75rem',
                whiteSpace: 'pre-wrap',
                maxHeight: '160px',
                overflowY: 'auto',
                border: '1px solid rgba(255,255,255,0.05)',
                fontFamily: 'monospace'
              }}>
                {optimizedOutput.optimized}
              </pre>
            </div>

            {/* Explanation / Reasoning */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--accent-secondary)' }}>Optimization Pipeline Notes:</span>
              <div style={{
                background: 'rgba(255,255,255,0.01)',
                padding: '0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                lineHeight: '1.45',
                borderLeft: '2px solid var(--accent-secondary)'
              }}>
                {optimizedOutput.explanation.split('\n').map((line, i) => (
                  <div key={i} style={{ marginBottom: '0.25rem' }}>{line}</div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
