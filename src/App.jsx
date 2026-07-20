import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import Workspace from './components/Workspace';
import MemoryGraph from './components/MemoryGraph';
import PromptLab from './components/PromptLab';
import { generateChatResponse } from './services/mockAI';
import { FileCode, Brain, Activity, Code } from 'lucide-react';

export default function App() {
  const [model, setModel] = useState('Nova-1.5-Pro');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState('You are Nova AI, a helpful agentic coding and reasoning assistant.');
  const [theme, setTheme] = useState('nebula');
  
  // Set default welcome message from AI
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am Nova AI, your futuristic agentic assistant. How can I assist you with your AI/ML research, design prototypes, or prompt engineering experiments today?",
      metrics: {
        latencyMs: 120,
        inputTokens: 0,
        outputTokens: 25,
        costUsd: 0.0
      },
      entities: [
        { subject: 'Nova AI', predicate: 'is a', object: 'Futuristic Assistant' }
      ]
    }
  ]);

  // Track session metrics HUD
  const [metrics, setMetrics] = useState({
    latency: 120,
    inputTokens: 0,
    outputTokens: 25,
    cost: 0.0
  });

  const [activeArtifact, setActiveArtifact] = useState(null);
  const [activePanel, setActivePanel] = useState('workspace'); // 'workspace', 'memory', 'prompt_lab'
  
  // List of active memory entities
  const [entities, setEntities] = useState([
    { subject: 'Nova AI', predicate: 'is a', object: 'Futuristic Assistant' }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle message sending
  const handleSendMessage = (text) => {
    // 1. Add User message
    const userMsg = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    // Parse model delay simulation
    const baseDelay = model === 'Nova-1.0-Flash' ? 400 : model === 'Nova-1.5-Pro' ? 1200 : 3000;
    
    setTimeout(() => {
      // 2. Generate response
      const response = generateChatResponse(text, model, temperature);
      
      const aiMsg = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: response.text,
        metrics: response.metrics,
        reasoning: response.reasoning,
        artifact: response.artifact,
        entities: response.entities
      };

      setMessages((prev) => [...prev, aiMsg]);
      
      // 3. Update memory graph entities (avoid duplicates)
      if (response.entities && response.entities.length > 0) {
        setEntities((prev) => {
          const merged = [...prev];
          response.entities.forEach((newEnt) => {
            if (!merged.some(e => e.subject === newEnt.subject && e.object === newEnt.object)) {
              merged.push(newEnt);
            }
          });
          return merged;
        });
      }

      // 4. Update session metrics
      setMetrics((prev) => ({
        latency: Math.round((prev.latency + response.metrics.latencyMs) / 2), // moving average
        inputTokens: prev.inputTokens + response.metrics.inputTokens,
        outputTokens: prev.outputTokens + response.metrics.outputTokens,
        cost: prev.cost + response.metrics.costUsd
      }));

      // 5. Auto open artifact in Workspace if generated
      if (response.artifact) {
        setActiveArtifact(response.artifact);
        setActivePanel('workspace');
      }

      setIsGenerating(false);
    }, baseDelay);
  };

  const handleRemoveEntity = (nodeId) => {
    setEntities((prev) => prev.filter(e => e.subject !== nodeId && e.object !== nodeId));
  };

  const handleAddEntity = (entity) => {
    setEntities((prev) => {
      // Check for duplicates
      if (prev.some(e => e.subject === entity.subject && e.object === entity.object)) {
        return prev;
      }
      return [...prev, entity];
    });
  };

  // Sync edits from the editor tab back to the artifact state so the Live Preview renders changes
  const handleCodeChange = (newCode) => {
    setActiveArtifact((prev) => {
      if (!prev) return null;
      return { ...prev, code: newCode };
    });
    
    // Also update the matching message in message history so it preserves the code changes
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg.artifact && msg.artifact.filename === activeArtifact.filename) {
          return {
            ...msg,
            artifact: { ...msg.artifact, code: newCode }
          };
        }
        return msg;
      })
    );
  };

  const handleClearChat = () => {
    setMessages([]);
    setActiveArtifact(null);
    setEntities([
      { subject: 'Nova AI', predicate: 'is a', object: 'Futuristic Assistant' }
    ]);
    setMetrics({
      latency: 0,
      inputTokens: 0,
      outputTokens: 0,
      cost: 0.0
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      {/* Parameters Controls Left Column */}
      <Sidebar
        model={model}
        setModel={setModel}
        temperature={temperature}
        setTemperature={setTemperature}
        maxTokens={maxTokens}
        setMaxTokens={setMaxTokens}
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
        metrics={metrics}
        theme={theme}
        setTheme={setTheme}
        onClearChat={handleClearChat}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
      />

      {/* Main Conversational Middle Column */}
      <main style={{ display: 'flex', flex: 1.1, flexDirection: 'column', height: '100%', borderRight: '1px solid var(--border-glow)' }}>
        <ChatArea
          messages={messages}
          onSendMessage={handleSendMessage}
          model={model}
          isGenerating={isGenerating}
          onSelectArtifact={(art) => {
            setActiveArtifact(art);
            setActivePanel('workspace');
          }}
          activeArtifact={activeArtifact}
        />
      </main>

      {/* Dynamic Inspector Right Column */}
      <section style={{ display: 'flex', flex: 1.2, flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Workspace Tab Bar Selector */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-glow)', background: 'var(--bg-secondary)', padding: '0 1rem' }}>
          <button
            onClick={() => setActivePanel('workspace')}
            style={{
              padding: '0.9rem 1.1rem',
              fontSize: '0.85rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activePanel === 'workspace' ? 'var(--accent-color)' : 'var(--text-muted)',
              borderBottom: activePanel === 'workspace' ? '2.5px solid var(--accent-color)' : '2.5px solid transparent',
              fontWeight: activePanel === 'workspace' ? '600' : '400',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s'
            }}
          >
            <FileCode size={14} /> Live Sandbox
          </button>
          <button
            onClick={() => setActivePanel('memory')}
            style={{
              padding: '0.9rem 1.1rem',
              fontSize: '0.85rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activePanel === 'memory' ? 'var(--accent-color)' : 'var(--text-muted)',
              borderBottom: activePanel === 'memory' ? '2.5px solid var(--accent-color)' : '2.5px solid transparent',
              fontWeight: activePanel === 'memory' ? '600' : '400',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s'
            }}
          >
            <Brain size={14} /> Graph RAG Map
          </button>
          <button
            onClick={() => setActivePanel('prompt_lab')}
            style={{
              padding: '0.9rem 1.1rem',
              fontSize: '0.85rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activePanel === 'prompt_lab' ? 'var(--accent-color)' : 'var(--text-muted)',
              borderBottom: activePanel === 'prompt_lab' ? '2.5px solid var(--accent-color)' : '2.5px solid transparent',
              fontWeight: activePanel === 'prompt_lab' ? '600' : '400',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s'
            }}
          >
            <Activity size={14} /> Prompt Lab
          </button>
        </div>

        {/* Selected View Rendering */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {activePanel === 'workspace' && (
            <Workspace 
              artifact={activeArtifact} 
              onCodeChange={handleCodeChange} 
            />
          )}
          {activePanel === 'memory' && (
            <MemoryGraph 
              entities={entities} 
              onRemoveEntity={handleRemoveEntity}
              onAddEntity={handleAddEntity}
            />
          )}
          {activePanel === 'prompt_lab' && (
            <PromptLab 
              temperature={temperature} 
              maxTokens={maxTokens} 
            />
          )}
        </div>
      </section>
    </div>
  );
}
