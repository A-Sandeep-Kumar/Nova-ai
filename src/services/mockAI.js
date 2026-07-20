/**
 * Mock AI Service for Nova AI
 * Simulates advanced LLM behaviors:
 * 1. Multi-model routing (Flash, Pro, Reasoning)
 * 2. Chain-of-Thought reasoning steps
 * 3. Dynamic entity/relationship extraction for Memory Graphs
 * 4. Code artifact generation (HTML, CSS, JS, SVG)
 * 5. Prompt optimization
 * 6. Detailed token, latency, and cost calculations
 */

const RESPONSES = {
  greeting: {
    text: "Hello! I am Nova AI, your futuristic agentic assistant. How can I assist you with your AI/ML research, design prototypes, or prompt engineering experiments today?",
    entities: [
      { subject: "Nova AI", predicate: "is a", object: "Futuristic Assistant" },
      { subject: "User", predicate: "can perform", object: "AI/ML research" }
    ]
  },
  default: {
    text: "I've analyzed your prompt. As an agent, I'm monitoring this workspace and updating your memory graph to track the conversation's semantic state. Let me know if you would like me to generate code, run a simulation, or structure a machine learning workflow.",
    entities: []
  }
};

// Simple rules to extract entities from user prompts to feed the Memory Graph
export function extractEntities(prompt) {
  const entities = [];
  const text = prompt.toLowerCase();

  // Extract name: "my name is X" or "I am X"
  const nameMatch = prompt.match(/(?:my name is|i am|i'm)\s+([A-Z][a-zA-Z]+)/);
  if (nameMatch && nameMatch[1]) {
    entities.push({ subject: "User", predicate: "name is", object: nameMatch[1] });
  }

  // Extract framework/language: "using react", "building with python"
  if (text.includes("react")) {
    entities.push({ subject: "Project", predicate: "uses framework", object: "React" });
  }
  if (text.includes("vue")) {
    entities.push({ subject: "Project", predicate: "uses framework", object: "Vue" });
  }
  if (text.includes("tailwind")) {
    entities.push({ subject: "Project", predicate: "uses styling", object: "Tailwind CSS" });
  }
  if (text.includes("python") || text.includes("machine learning") || text.includes("ml") || text.includes("ai")) {
    entities.push({ subject: "Project", predicate: "uses language", object: "Python" });
    entities.push({ subject: "User", predicate: "focuses on", object: "AI/ML" });
  }
  if (text.includes("vite")) {
    entities.push({ subject: "Project", predicate: "built with", object: "Vite" });
  }

  // Extract project type: "building a fitness tracker", "creating a website"
  const buildMatch = prompt.match(/(?:building|creating|making|developing|designing)\s+(?:a|an)?\s*([a-zA-Z\s]+?)(?:\s+using|\s+with|\s+in|\.|$)/i);
  if (buildMatch && buildMatch[1]) {
    const projName = buildMatch[1].trim();
    if (projName.length < 30) {
      entities.push({ subject: "User", predicate: "is building", object: projName });
      entities.push({ subject: "Project", predicate: "is defined as", object: projName });
    }
  }

  // Extract interest: "i like X", "i want X", "interested in X"
  const interestMatch = prompt.match(/(?:i like|i love|i want|interested in)\s+([a-zA-Z\s]+?)(?:\.|$)/i);
  if (interestMatch && interestMatch[1]) {
    const interest = interestMatch[1].trim();
    if (interest.length < 25) {
      entities.push({ subject: "User", predicate: "interested in", object: interest });
    }
  }

  return entities;
}

// Generate code templates for artifacts based on prompt keywords
function getGeneratedCode(prompt) {
  const text = prompt.toLowerCase();

  if (text.includes("landing page") || text.includes("website") || text.includes("portfolio")) {
    return {
      filename: "index.html",
      language: "html",
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nova AI - Dynamic Sandbox</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: radial-gradient(circle at center, #0f172a, #020617);
      color: #e2e8f0;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
    }
    .card {
      background: rgba(30, 41, 59, 0.5);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2.5rem;
      text-align: center;
      max-width: 450px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.05);
      animation: float 6s ease-in-out infinite;
    }
    h1 {
      margin-top: 0;
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #94a3b8;
      line-height: 1.6;
    }
    .btn {
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Nova Sandbox Live</h1>
    <p>This is a live responsive preview generated dynamically in real-time. You can edit the code in the editor tab and see it render immediately!</p>
    <button class="btn" onclick="alert('System activated!')">Execute Action</button>
  </div>
</body>
</html>`
    };
  }

  if (text.includes("clock") || text.includes("timer")) {
    return {
      filename: "clock.html",
      language: "html",
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: #090d16;
      color: #00ffcc;
      font-family: monospace;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .clock-container {
      border: 2px solid #00ffcc;
      padding: 30px;
      border-radius: 10px;
      background: rgba(0, 255, 204, 0.05);
      box-shadow: 0 0 20px rgba(0, 255, 204, 0.2);
      text-align: center;
    }
    .time {
      font-size: 4rem;
      font-weight: bold;
      letter-spacing: 5px;
      text-shadow: 0 0 10px rgba(0, 255, 204, 0.8);
    }
    .date {
      color: #88a0c0;
      margin-top: 10px;
      font-size: 1.2rem;
    }
  </style>
</head>
<body>
  <div class="clock-container">
    <div class="time" id="clock">00:00:00</div>
    <div class="date" id="date">LOADING DATE</div>
  </div>
  <script>
    function updateClock() {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      document.getElementById('clock').textContent = timeStr;
      
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      document.getElementById('date').textContent = now.toLocaleDateString(undefined, options).toUpperCase();
    }
    setInterval(updateClock, 1000);
    updateClock();
  </script>
</body>
</html>`
    };
  }

  if (text.includes("chart") || text.includes("visualization") || text.includes("graph")) {
    return {
      filename: "chart.html",
      language: "html",
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: #020617;
      color: #f1f5f9;
      font-family: sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .chart-container {
      width: 80%;
      max-width: 600px;
      background: #0f172a;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    h3 { margin-top: 0; color: #38bdf8; }
    .bar-group {
      margin: 15px 0;
    }
    .label {
      margin-bottom: 5px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
    }
    .track {
      background: #334155;
      height: 12px;
      border-radius: 6px;
      overflow: hidden;
    }
    .fill {
      background: linear-gradient(90deg, #0ea5e9, #8b5cf6);
      height: 100%;
      border-radius: 6px;
      width: 0%;
      transition: width 1.5s ease-out;
    }
  </style>
</head>
<body>
  <div class="chart-container">
    <h3>Nova Performance Metrics</h3>
    
    <div class="bar-group">
      <div class="label"><span>Accuracy</span><span>94.8%</span></div>
      <div class="track"><div class="fill" style="width: 94.8%"></div></div>
    </div>
    <div class="bar-group">
      <div class="label"><span>Latency Efficiency</span><span>88.2%</span></div>
      <div class="track"><div class="fill" style="width: 88.2%"></div></div>
    </div>
    <div class="bar-group">
      <div class="label"><span>Cost Saving</span><span>72.5%</span></div>
      <div class="track"><div class="fill" style="width: 72.5%"></div></div>
    </div>
  </div>
</body>
</html>`
    };
  }

  if (text.includes("svg") || text.includes("logo") || text.includes("drawing")) {
    return {
      filename: "nova-logo.svg",
      language: "svg",
      code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="primary" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  
  <!-- Glow Background -->
  <circle cx="100" cy="100" r="90" fill="url(#glow)"/>
  
  <!-- Outer Ring -->
  <circle cx="100" cy="100" r="70" fill="none" stroke="url(#primary)" stroke-width="2" stroke-dasharray="10 6" opacity="0.6">
    <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite"/>
  </circle>
  
  <!-- Central Tech Shape -->
  <polygon points="100,45 145,80 145,130 100,165 55,130 55,80" fill="none" stroke="url(#primary)" stroke-width="3"/>
  
  <!-- Inside core -->
  <circle cx="100" cy="100" r="20" fill="none" stroke="#38bdf8" stroke-width="2"/>
  <circle cx="100" cy="100" r="6" fill="#8b5cf6">
    <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
  </circle>
  
  <!-- Orbits -->
  <line x1="100" y1="25" x2="100" y2="175" stroke="#8b5cf6" stroke-width="1" opacity="0.4"/>
  <line x1="25" y1="100" x2="175" y2="100" stroke="#8b5cf6" stroke-width="1" opacity="0.4"/>
</svg>`
    };
  }

  return null;
}

// Generate the chat answer
export function generateChatResponse(prompt, model, temperature = 0.7) {
  const result = {
    text: "",
    reasoning: [],
    metrics: {
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: 0,
      costUsd: 0
    },
    artifact: null,
    entities: []
  };

  // 1. Calculate metrics based on model
  const promptLength = prompt.length;
  const wordCount = prompt.split(/\s+/).length;
  result.metrics.inputTokens = Math.max(15, Math.ceil(wordCount * 1.3));

  // Determine response speed and styling based on model
  let speedMultiplier = 1;
  let costPerInputToken = 0;
  let costPerOutputToken = 0;

  if (model === "Nova-1.0-Flash") {
    speedMultiplier = 0.25;
    costPerInputToken = 0.000000075;
    costPerOutputToken = 0.0000003;
  } else if (model === "Nova-1.5-Pro") {
    speedMultiplier = 1.0;
    costPerInputToken = 0.00000125;
    costPerOutputToken = 0.00000375;
  } else if (model === "Nova-Reasoning") {
    speedMultiplier = 2.8;
    costPerInputToken = 0.000002;
    costPerOutputToken = 0.000006;
  }

  // 2. Formulate CoT reasoning steps if reasoning model selected
  if (model === "Nova-Reasoning") {
    result.reasoning = [
      "Deconstructing user query constraints & analyzing tokens...",
      "Searching memory store for contextual entities related to prompt...",
      "Generating response candidates using tree-of-thought routing...",
      "Simulating and optimizing output structures & code blocks...",
      "Performing self-evaluation checklist (accuracy and safety checks)...",
      "Re-formatting code output style to compliant standard formatting."
    ];
  }

  // 3. Extract entities for Memory Graph
  result.entities = extractEntities(prompt);

  // 4. Generate core response and check for code request
  const codeArtifact = getGeneratedCode(prompt);
  const textLower = prompt.toLowerCase();

  let bodyText = "";
  if (codeArtifact) {
    result.artifact = codeArtifact;
    bodyText = `I have generated the file \`${codeArtifact.filename}\` in the interactive workspace side-panel. You can switch to the Code editor tab or open the **Live Preview** tab to see it render live. 

Here is the source code for your reference:

\`\`\`${codeArtifact.language}:${codeArtifact.filename}
${codeArtifact.code}
\`\`\`

Let me know if you would like me to explain the structure or add specific styles and scripts to it!`;

    // Add extra entities
    result.entities.push({ subject: "Artifact", predicate: "contains file", object: codeArtifact.filename });
    result.entities.push({ subject: "Workspace", predicate: "renders live", object: codeArtifact.filename });
  } else if (textLower.includes("hello") || textLower.includes("hi ") || textLower.includes("hey")) {
    bodyText = RESPONSES.greeting.text;
    result.entities = [...result.entities, ...RESPONSES.greeting.entities];
  } else if (textLower.includes("memory") || textLower.includes("graph")) {
    bodyText = "The **Semantic Memory Graph** is visualizing the entities extracted from our conversation in real-time. You can see how words you type (like languages, frameworks, or projects) are extracted as nodes and linked. This represents a modern Graph RAG (Retrieval Augmented Generation) structure where the AI queries its memory nodes for context injection prior to generation.";
    result.entities.push({ subject: "Graph RAG", predicate: "models", object: "Semantic memory" });
  } else if (textLower.includes("temperature") || textLower.includes("top_p")) {
    bodyText = `Temperature controls the randomness (entropy) of my predictions. At a temperature of **${temperature.toFixed(1)}**:
- ${temperature < 0.4 ? "The generation is highly **deterministic** and focused on the most probable words. Good for code and structured responses." : temperature > 0.8 ? "The generation has higher **entropy**, introducing less common, more creative words into the selection pool." : "The selection is balanced between coherent logic and conversational fluency."}
You can observe the token probability curve shift in the Prompt Lab settings panel.`;
  } else {
    bodyText = `I have received and processed your input. Based on my system configuration (using ${model}), I have updated the semantic memory model. 

*If you are testing this for resume verification, try entering commands like:*
- *"create a beautiful analog clock"*
- *"design a responsive landing page"*
- *"generate an SVG logo"*
- *"add framework React and language Python"* to see the node graph grow!`;
  }

  result.text = bodyText;

  // Compute final token metrics
  const responseWordCount = result.text.split(/\s+/).length;
  result.metrics.outputTokens = Math.max(30, Math.ceil(responseWordCount * 1.3));
  
  // Calculate simulated latency
  const baseLatency = model === "Nova-1.0-Flash" ? 300 : model === "Nova-1.5-Pro" ? 900 : 2500;
  result.metrics.latencyMs = Math.round(baseLatency + Math.random() * 500 * speedMultiplier);

  // Compute exact cost
  result.metrics.costUsd = (result.metrics.inputTokens * costPerInputToken) + (result.metrics.outputTokens * costPerOutputToken);
  // Round cost to 6 decimals
  result.metrics.costUsd = parseFloat(result.metrics.costUsd.toFixed(6));

  return result;
}

// Prompt engineering optimization function
export function optimizePrompt(rawPrompt) {
  if (!rawPrompt || rawPrompt.trim().length === 0) {
    return {
      optimized: "You have not entered a prompt yet. Please enter a simple query in the chat.",
      explanation: "No raw query detected."
    };
  }

  const role = "You are Nova AI, an expert agentic chatbot specializing in high-performance coding and technical system architecture.";
  const context = "The user is running this context in a reactive sandboxed portfolio workstation with a live preview iframe.";
  const constraints = "OUTPUT formatting must be strictly structured. If generating code, wrap it cleanly in a labeled markdown block (e.g. ```html:filename.ext). Always provide brief reasoning steps.";
  
  const optimized = `[SYSTEM INST]: ${role} ${context}
[USER CONTEXT]: The user is developing a web-based interface.
[CONSTRAINTS]: ${constraints}
---
[RAW QUERY]: "${rawPrompt}"
---
[OPTIMIZED PROMPT]:
"Analyze the raw query: '${rawPrompt}'. 
1. If code is requested, construct a clean, self-contained single-file demonstration.
2. Structure the styling using modern glassmorphism elements, including CSS custom variables.
3. Outline the files, technologies, and features created at the start of your response."`;

  const explanation = `1. **Role Definition**: Injected a high-agency persona to improve response depth.
2. **Context Embedding**: Provided the model with details about the sandboxed preview environment.
3. **Structured Constraints**: Enforced code-block formatting constraints to enable the workspace extraction engine.
4. **Few-Shot / Reasoning Injection**: Prompted the model to perform analysis in defined stages (1, 2, 3) to trigger chain-of-thought routing.`;

  return { optimized, explanation };
}
