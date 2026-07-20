import React, { useState, useEffect, useRef } from 'react';
import { Database, Trash2, HelpCircle, GitCommit, Plus, Brain } from 'lucide-react';

export default function MemoryGraph({ entities, onRemoveEntity, onAddEntity }) {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [newSubject, setNewSubject] = useState('User');
  const [newPredicate, setNewPredicate] = useState('likes');
  const [newObject, setNewObject] = useState('');

  const svgRef = useRef(null);

  // Default central nodes
  const defaultNodes = [
    { id: 'Nova AI', label: 'Nova AI', type: 'agent', x: 220, y: 180, fx: 220, fy: 180 },
    { id: 'User', label: 'Local User', type: 'user', x: 220, y: 280 }
  ];

  const defaultLinks = [
    { source: 'User', target: 'Nova AI', label: 'communicates with' }
  ];

  // Sync entities from prop into Graph Nodes and Links
  useEffect(() => {
    // Start with defaults
    const currentNodes = [...defaultNodes];
    const currentLinks = [...defaultLinks];

    entities.forEach((ent) => {
      const subId = ent.subject;
      const objId = ent.object;

      // Add subject node if not exists
      if (!currentNodes.some(n => n.id === subId)) {
        currentNodes.push({
          id: subId,
          label: subId,
          type: subId === 'User' ? 'user' : 'concept',
          x: 100 + Math.random() * 240,
          y: 80 + Math.random() * 220
        });
      }

      // Add object node if not exists
      if (!currentNodes.some(n => n.id === objId)) {
        currentNodes.push({
          id: objId,
          label: objId,
          type: 'concept',
          x: 100 + Math.random() * 240,
          y: 80 + Math.random() * 220
        });
      }

      // Add link if not exists
      if (!currentLinks.some(l => l.source === subId && l.target === objId)) {
        currentLinks.push({
          source: subId,
          target: objId,
          label: ent.predicate
        });
      }
    });

    // Radial layout for concept nodes to spread them nicely
    const concepts = currentNodes.filter(n => n.type === 'concept');
    concepts.forEach((node, index) => {
      // If node coordinates are close to random, arrange them radially
      const angle = (index * 2 * Math.PI) / Math.max(1, concepts.length);
      const radius = 110 + (index % 2) * 35;
      node.x = 220 + radius * Math.cos(angle);
      node.y = 180 + radius * Math.sin(angle);
    });

    setNodes(currentNodes);
    setLinks(currentLinks);
  }, [entities]);

  // Gentle float animation logic
  useEffect(() => {
    let animationFrameId;
    let time = 0;

    const animate = () => {
      time += 0.03;
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          // Don't animate dragging node or static anchor node
          if (node.id === draggingNodeId || node.id === 'Nova AI') return node;
          
          // Apply a tiny floating offset based on sine/cosine
          const offsetIndex = node.id.charCodeAt(0) || 1;
          const floatX = Math.sin(time + offsetIndex) * 0.15;
          const floatY = Math.cos(time + offsetIndex) * 0.15;

          return {
            ...node,
            x: node.x + floatX,
            y: node.y + floatY
          };
        })
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [draggingNodeId]);

  // Mouse Drag handlers
  const handleMouseDown = (node, e) => {
    if (node.id === 'Nova AI') return; // Anchor Central AI
    e.stopPropagation();
    
    // Get mouse position relative to SVG
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setDraggingNodeId(node.id);
    setDragOffset({
      x: mouseX - node.x,
      y: mouseY - node.y
    });
    setSelectedNode(node);
  };

  const handleMouseMove = (e) => {
    if (!draggingNodeId) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === draggingNodeId) {
          // Constrain coordinates within SVG viewbox bounds
          const newX = Math.max(30, Math.min(410, mouseX - dragOffset.x));
          const newY = Math.max(30, Math.min(330, mouseY - dragOffset.y));
          return { ...node, x: newX, y: newY };
        }
        return node;
      })
    );
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  const handleAddManualMemory = (e) => {
    e.preventDefault();
    if (!newObject.trim()) return;

    if (onAddEntity) {
      onAddEntity({
        subject: newSubject,
        predicate: newPredicate,
        object: newObject.trim()
      });
      setNewObject('');
    }
  };

  const handleDeleteMemory = (nodeId) => {
    if (nodeId === 'Nova AI' || nodeId === 'User') {
      alert('Default system nodes cannot be deleted.');
      return;
    }

    // Filter out connections relating to this node
    if (onRemoveEntity) {
      onRemoveEntity(nodeId);
    }
    setSelectedNode(null);
  };

  // Helper to draw connecting line coordinate pointers
  const getLinkCoordinates = (link) => {
    const sourceNode = nodes.find(n => n.id === link.source);
    const targetNode = nodes.find(n => n.id === link.target);

    if (!sourceNode || !targetNode) return { x1: 0, y1: 0, x2: 0, y2: 0 };
    return {
      x1: sourceNode.x,
      y1: sourceNode.y,
      x2: targetNode.x,
      y2: targetNode.y
    };
  };

  return (
    <div className="glass-panel" style={{ flex: 1.2, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: '360px' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Brain size={16} style={{ color: 'var(--accent-color)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Semantic memory Graph RAG</span>
        </div>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
          Interactive Nodes: {nodes.length}
        </span>
      </header>

      {/* Main Canvas Node View */}
      <div 
        style={{ flex: 1, position: 'relative', background: '#02040a', cursor: draggingNodeId ? 'grabbing' : 'default', userSelect: 'none' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Subtle Tech Grid Background */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(var(--border-glow) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.15,
          pointerEvents: 'none'
        }} />

        <svg 
          ref={svgRef}
          viewBox="0 0 440 360" 
          style={{ width: '100%', height: '100%', display: 'block' }}
          onClick={() => setSelectedNode(null)}
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-color)" opacity="0.4" />
            </marker>
          </defs>

          {/* Links / Connections */}
          {links.map((link, idx) => {
            const coords = getLinkCoordinates(link);
            const midX = (coords.x1 + coords.x2) / 2;
            const midY = (coords.y1 + coords.y2) / 2;

            return (
              <g key={idx}>
                {/* Visual line */}
                <line
                  x1={coords.x1}
                  y1={coords.y1}
                  x2={coords.x2}
                  y2={coords.y2}
                  stroke="var(--accent-color)"
                  strokeWidth="1.5"
                  opacity="0.3"
                  markerEnd="url(#arrow)"
                />
                
                {/* Relationship label */}
                <rect 
                  x={midX - 35} 
                  y={midY - 8} 
                  width="70" 
                  height="14" 
                  rx="4" 
                  fill="#02040a" 
                  stroke="var(--border-glow)" 
                  strokeWidth="0.5" 
                  opacity="0.8" 
                />
                <text
                  x={midX}
                  y={midY + 2}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize="6.5"
                  fontWeight="600"
                >
                  {link.label}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isAgent = node.type === 'agent';
            const isUser = node.type === 'user';
            
            // Set node coloring
            let fill = 'var(--bg-tertiary)';
            let stroke = 'var(--border-glow)';
            let textColor = 'var(--text-main)';

            if (isAgent) {
              fill = 'var(--accent-color)';
              stroke = 'var(--accent-secondary)';
              textColor = '#fff';
            } else if (isUser) {
              fill = 'var(--accent-secondary)';
              stroke = 'var(--accent-color)';
              textColor = '#fff';
            } else if (isSelected) {
              stroke = '#fff';
            }

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseDown={(e) => handleMouseDown(node, e)}
                style={{ cursor: isAgent ? 'default' : 'grab' }}
              >
                {/* Neon shadow glow */}
                <circle
                  r={isAgent || isUser ? 22 : 18}
                  fill="transparent"
                  stroke={isSelected ? 'var(--accent-color)' : stroke}
                  strokeWidth={isSelected ? 6 : 1}
                  opacity={isSelected ? 0.3 : 0.15}
                  style={{ transition: 'all 0.1s' }}
                />

                {/* Main Node Circle */}
                <circle
                  r={isAgent || isUser ? 16 : 13}
                  fill={fill}
                  stroke={isSelected ? '#fff' : stroke}
                  strokeWidth={isSelected ? 2 : 1.5}
                />

                {/* Node Label Text */}
                <text
                  y={isAgent || isUser ? 26 : 22}
                  textAnchor="middle"
                  fill={isSelected ? '#fff' : 'var(--text-main)'}
                  fontSize="8"
                  fontWeight="700"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Floating Details HUD */}
        {selectedNode && (
          <div 
            className="glass-card" 
            style={{ 
              position: 'absolute', 
              top: '1rem', 
              right: '1rem', 
              padding: '0.75rem', 
              width: '180px', 
              fontSize: '0.8rem', 
              zIndex: 5,
              border: '1px solid var(--border-glow)' 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem' }}>
              <span style={{ fontWeight: '700', color: 'var(--accent-color)' }}>Node Inspector</span>
              <button 
                onClick={() => setSelectedNode(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem' }}
              >
                ✕
              </button>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Label:</span>
              <div style={{ fontWeight: '600' }}>{selectedNode.label}</div>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Type:</span>
              <div style={{ textTransform: 'capitalize', fontWeight: '500' }}>{selectedNode.type}</div>
            </div>

            {selectedNode.id !== 'Nova AI' && selectedNode.id !== 'User' ? (
              <button
                onClick={() => handleDeleteMemory(selectedNode.id)}
                className="glow-btn"
                style={{
                  width: '100%',
                  padding: '0.3rem',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444',
                  color: '#ef4444',
                  fontSize: '0.7rem',
                  justifyContent: 'center',
                  marginTop: '0.5rem'
                }}
              >
                <Trash2 size={10} /> Delete Memory Node
              </button>
            ) : (
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Protected core node.</span>
            )}
          </div>
        )}
      </div>

      {/* Manual Memory Injection Panel (Shows off Graph database concept) */}
      <footer style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.15)', borderTop: '1px solid var(--border-glow)' }}>
        <form onSubmit={handleAddManualMemory} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <GitCommit size={12} /> Inject Memory Relationship
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.5fr 0.5fr', gap: '0.35rem', alignItems: 'center' }}>
            <select
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="glow-input"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.4rem', background: 'var(--bg-primary)' }}
            >
              <option value="User">User</option>
              <option value="Project">Project</option>
              <option value="Nova AI">Nova AI</option>
            </select>

            <select
              value={newPredicate}
              onChange={(e) => setNewPredicate(e.target.value)}
              className="glow-input"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.4rem', background: 'var(--bg-primary)' }}
            >
              <option value="likes">likes</option>
              <option value="uses">uses</option>
              <option value="is building">is building</option>
              <option value="wants to learn">wants to learn</option>
              <option value="supports">supports</option>
            </select>

            <input
              type="text"
              value={newObject}
              onChange={(e) => setNewObject(e.target.value)}
              placeholder="e.g. Next.js"
              className="glow-input"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.4rem' }}
            />

            <button
              type="submit"
              className="glow-btn"
              style={{ padding: '0.25rem', height: '100%', justifyContent: 'center' }}
              disabled={!newObject.trim()}
            >
              <Plus size={14} />
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}
