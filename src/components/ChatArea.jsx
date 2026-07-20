import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Terminal, ChevronDown, ChevronUp, Clock, Coins, Sparkles, AlertCircle } from 'lucide-react';

export default function ChatArea({
  messages,
  onSendMessage,
  model,
  isGenerating,
  onSelectArtifact,
  activeArtifact
}) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState({});
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev + ' ' + transcript).trim());
        setIsListening(false);
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error', e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleSpeech = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Try Chrome/Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    onSendMessage(input);
    setInput('');
  };

  const toggleReasoning = (msgId) => {
    setExpandedReasoning((prev) => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  // Speaks out the AI response text
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      // Clean up markdown/code tags for speech
      const cleanText = text
        .replace(/```[\s\S]*?```/g, '[Generates code artifact]')
        .replace(/[*_`#]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 300)); // limit length for sanity
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <section className="chat-container-main" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', position: 'relative', background: 'var(--bg-primary)' }}>
      {/* Top Info Bar */}
      <header className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-glow)', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-main)' }}>Neural Link Online</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Active Engine: <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>{model}</span>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', padding: '1.25rem', gap: '1.25rem' }}>
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '400px', margin: 'auto' }}>
            <Sparkles size={40} className="pulse-glow-element" style={{ color: 'var(--accent-color)', opacity: 0.6 }} />
            <h3 style={{ color: 'var(--text-main)' }}>Nova AI Agent Workstation</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
              Welcome to your futuristic chat interface. Enter a query below. Ask for designs like <strong>"generate a responsive website landing page"</strong> to open the live sandbox, or view how context builds in the <strong>Graph RAG Map</strong> tab.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              width: '100%',
              gap: '0.35rem'
            }}
          >
            {/* Sender Label */}
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {msg.sender === 'user' ? 'Local User Node' : `${model} (Agent)`}
            </span>

            {/* Collapsible Chain-of-Thought Reasoning Block */}
            {msg.sender === 'ai' && msg.reasoning && msg.reasoning.length > 0 && (
              <div 
                className="glass-panel" 
                style={{ 
                  width: '100%', 
                  maxWidth: '650px', 
                  borderRadius: '8px', 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px dashed rgba(255, 255, 255, 0.08)',
                  padding: '0.5rem 0.75rem', 
                  fontSize: '0.75rem',
                  marginBottom: '0.25rem'
                }}
              >
                <button
                  onClick={() => toggleReasoning(msg.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--accent-color)',
                    fontWeight: '600',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Terminal size={12} /> {expandedReasoning[msg.id] ? 'Hide Chain-of-Thought' : 'View Reasoning Logs (CoT)'}
                  </span>
                  {expandedReasoning[msg.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {expandedReasoning[msg.id] && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingLeft: '0.5rem', borderLeft: '1.5px solid var(--accent-color)', color: 'var(--text-muted)' }}>
                    {msg.reasoning.map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--accent-secondary)' }}>[{idx + 1}]</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Message Bubble */}
            <div
              className="glass-panel"
              style={{
                maxWidth: '85%',
                padding: '0.85rem 1.1rem',
                borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--bg-tertiary), rgba(139, 92, 246, 0.1))' : 'var(--bg-secondary)',
                border: msg.sender === 'user' ? '1px solid var(--border-glow)' : '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: msg.sender === 'user' ? 'var(--glow-intensity)' : 'none',
                lineHeight: '1.5',
                fontSize: '0.92rem',
                whiteSpace: 'pre-wrap',
                position: 'relative'
              }}
            >
              {msg.text}

              {/* Artifact Button Link */}
              {msg.artifact && (
                <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.75rem' }}>
                  <button
                    onClick={() => onSelectArtifact(msg.artifact)}
                    className="glow-btn"
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.75rem',
                      background: activeArtifact?.filename === msg.artifact.filename 
                        ? 'linear-gradient(135deg, var(--accent-secondary), var(--accent-color))' 
                        : 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-glow)'
                    }}
                  >
                    <Sparkles size={12} /> {activeArtifact?.filename === msg.artifact.filename ? 'Viewing Artifact' : 'Deploy Live Workspace'}
                  </button>
                </div>
              )}
            </div>

            {/* Metrics HUD below Bubble */}
            {msg.sender === 'ai' && msg.metrics && (
              <div style={{ display: 'flex', gap: '0.65rem', fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: '4px', marginTop: '1px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Clock size={10} /> {msg.metrics.latencyMs} ms
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  Tokens: {msg.metrics.inputTokens + msg.metrics.outputTokens}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#10b981', fontWeight: '500' }}>
                  <Coins size={10} /> ${msg.metrics.costUsd.toFixed(6)}
                </span>
                <span>•</span>
                <button 
                  onClick={() => speakText(msg.text)} 
                  style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.65rem', padding: 0 }}
                >
                  🔊 Speak
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Generative Pulsing Indicator */}
        {isGenerating && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              {model} is processing...
            </span>
            <div
              className="glass-panel pulse-glow-element"
              style={{
                width: '60px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                borderRadius: '16px 16px 16px 2px',
                background: 'var(--bg-secondary)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-color)', animation: 'bounce 1.4s infinite ease-in-out both' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-color)', animation: 'bounce 1.4s infinite ease-in-out both 0.2s' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-color)', animation: 'bounce 1.4s infinite ease-in-out both 0.4s' }} />
            </div>
            <style>{`
              @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1.0); }
              }
            `}</style>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Speech waveform when listening */}
      {isListening && (
        <div style={{ position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: 'rgba(3,0,20,0.85)', padding: '0.75rem 1.5rem', borderRadius: '24px', border: '1px solid var(--accent-color)', boxShadow: 'var(--glow-intensity)', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '24px' }}>
            <div className="wave-bar" style={{ animationDelay: '0.1s' }} />
            <div className="wave-bar" style={{ animationDelay: '0.3s' }} />
            <div className="wave-bar" style={{ animationDelay: '0.5s' }} />
            <div className="wave-bar" style={{ animationDelay: '0.7s' }} />
            <div className="wave-bar" style={{ animationDelay: '0.2s' }} />
            <div className="wave-bar" style={{ animationDelay: '0.4s' }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: '500' }}>AI Interface Listening...</span>
          <style>{`
            .wave-bar {
              width: 3px;
              height: 8px;
              background: var(--accent-color);
              border-radius: 2px;
              animation: waveOsc 1s infinite alternate ease-in-out;
            }
            @keyframes waveOsc {
              0% { height: 6px; }
              100% { height: 24px; }
            }
          `}</style>
        </div>
      )}

      {/* Chat Form Input */}
      <form
        onSubmit={handleSubmit}
        className="glass-panel"
        style={{
          display: 'flex',
          padding: '0.75rem 1rem',
          gap: '0.75rem',
          margin: '0 1.25rem 1.25rem 1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--border-glow)',
          alignItems: 'center'
        }}
      >
        <button
          type="button"
          onClick={toggleSpeech}
          className="glow-btn"
          style={{
            padding: '0.5rem',
            borderRadius: '50%',
            background: isListening ? '#ef4444' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isListening ? '#ef4444' : 'var(--border-glow)'}`,
            boxShadow: isListening ? '0 0 10px #ef4444' : 'none',
            flexShrink: 0
          }}
          title="Voice Control Mode"
        >
          {isListening ? <MicOff size={16} color="#fff" /> : <Mic size={16} color="var(--text-main)" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Nova to write code or update system properties..."
          className="glow-input"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            padding: 0
          }}
          disabled={isGenerating}
        />

        <button
          type="submit"
          className="glow-btn"
          disabled={isGenerating || !input.trim()}
          style={{
            padding: '0.5rem 1rem',
            opacity: !input.trim() || isGenerating ? 0.5 : 1,
            cursor: !input.trim() || isGenerating ? 'not-allowed' : 'pointer'
          }}
        >
          <Send size={15} />
        </button>
      </form>
    </section>
  );
}
