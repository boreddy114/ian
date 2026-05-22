"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Sidebar from "../components/Sidebar";
import DocumentView from "../components/DocumentView";

const GraphView = dynamic(() => import("../components/GraphView"), { ssr: false });

const initialData = {
  nodes: [
    { id: "1", name: "Apple Inc.", group: "company" },
    { id: "2", name: "Tech Sector", group: "sector" },
    { id: "3", name: "AAPL Initiation", group: "memo", memoId: "aapl_q3" },
    { id: "4", name: "Microsoft", group: "company" },
    { id: "5", name: "Nvidia", group: "company" },
    { id: "6", name: "AI Theme", group: "theme" },
    { id: "7", name: "MSFT Earnings", group: "memo", memoId: "msft_q1" },
    { id: "8", name: "Capital Cycle", group: "framework" },
    { id: "9", name: "Scarcity", group: "framework" },
    { id: "10", name: "Amazon", group: "company" },
  ],
  links: [
    { source: "1", target: "2" },
    { source: "3", target: "1" },
    { source: "4", target: "2" },
    { source: "5", target: "2" },
    { source: "6", target: "5" },
    { source: "6", target: "4" },
    { source: "7", target: "4" },
    { source: "8", target: "2" },
    { source: "9", target: "5" },
    { source: "3", target: "9" },
    { source: "10", target: "2" },
  ]
};

export const MOCK_MEMOS: Record<string, any> = {
  "aapl_q3": {
    title: "Apple Inc. Initiation Memo",
    author: "Nexus AI Analyst",
    date: "Q3 2026",
    company: "AAPL",
    framework: "Scarcity Framework",
    content: "Apple's physical tether properties provide a safe haven amidst software rotation. We expect continued margin expansion through Services.",
    tracker: ["Services revenue acceleration", "iPhone replacement cycle", "Valuation multiple expansion"]
  },
  "msft_q1": {
    title: "Microsoft Earnings Update",
    author: "Nexus AI Analyst",
    date: "Q1 2026",
    company: "MSFT",
    framework: "Scale Economies",
    content: "Azure growth re-accelerated to 31% YoY, driven by AI workloads. Co-pilot adoption is showing signs of widespread enterprise penetration.",
    tracker: ["Azure AI run-rate", "Co-pilot ARR", "Capex efficiency"]
  }
};

export default function Home() {
  const [graphData, setGraphData] = useState(initialData);
  const [activeMemoId, setActiveMemoId] = useState<string | null>("aapl_q3");
  const [assistantType, setAssistantType] = useState<'designer' | 'finance'>('designer');
  const [memos, setMemos] = useState<Record<string, any>>(MOCK_MEMOS);
  const [isGraphFullscreen, setIsGraphFullscreen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeMobileView, setActiveMobileView] = useState<'assistant' | 'graph' | 'document'>('assistant');

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Prevent the default browser handling (which Next.js hook listens to)
      event.preventDefault();
      console.warn("Prevented unhandled promise rejection error:", event.reason);
    };
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput === "1234") {
      setIsLoggedIn(true);
      setLoginError(null);
    } else {
      setLoginError("Invalid credentials. Please try again.");
    }
  };
  
  const [designerMessages, setDesignerMessages] = useState<any[]>([
    { 
      role: 'ai', 
      content: "Welcome to the **NexusFinance.AI Memo Builder**! I synthesize institutional-grade buy-side investment memos and structure them in your document view on the right.\n\nHere are some of the ways you can direct me:\n1. **Initiate coverage** on a stock: *'Build initiation memo for Apple (AAPL)'*\n2. **Update rating stances** on active memos: *'Upgrade active memo rating to Buy stance'*\n3. **Include financial charts**: *'Add a valuation multiple sensitivity chart'*\n4. **Append details**: *'Add regulatory risk bullet to active memo'*\n\nSelect any suggested query below to begin." 
    }
  ]);
  const [financeMessages, setFinanceMessages] = useState<any[]>([
    { 
      role: 'ai', 
      content: "Hey Ian! I'm your **Interactive Finance Copilot**. I analyze numbers, construct visualizations, and generate premium reports directly.\n\nAsk me queries such as:\n1. **Deconstruct revenue drivers**: *'Show Apple services vs hardware revenue'*\n2. **Graph key growth rates**: *'Show Azure YoY growth rate over last 5 quarters'*\n3. **Perform peer comparison**: *'Compare CY2026 growth rates of megacap tech'*\n4. **Generate dynamic reports**: *'Generate Apple Inc. Financial Performance Report'*\n\nLet's get started — ask a question or click a suggestion below!" 
    }
  ]);

  const handleNodeClick = (node: any) => {
    if (node.memoId) {
      setActiveMemoId(node.memoId);
      setActiveMobileView('document');
    }
  };

  const handleSelectMemo = (memoId: string) => {
    setActiveMemoId(memoId);
    setActiveMobileView('document');
  };

  const handleGenerate = async (prompt: string) => {
    const type = assistantType;
    const activeSetter = type === 'designer' ? setDesignerMessages : setFinanceMessages;
    
    // Add user message immediately
    activeSetter(prev => [...prev, { role: 'user', content: prompt }]);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          assistantType: type,
          activeMemo: type === 'designer' && activeMemoId ? memos[activeMemoId] : null
        })
      });
      
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      
      if (type === 'designer') {
        if (data.isEdit && activeMemoId) {
          // Update existing active memo
          setMemos(prev => ({
            ...prev,
            [activeMemoId]: data.memo
          }));
          
          setDesignerMessages(prev => [...prev, {
            role: 'ai',
            content: data.response,
            chart: data.chart || null
          }]);
        } else {
          // Generate new memo
          const newMemoId = "new_memo_" + Date.now();
          setMemos(prev => ({
            ...prev,
            [newMemoId]: data.memo
          }));

          const newNodeId = "node_" + Date.now();
          setGraphData(prev => ({
            nodes: [...prev.nodes, { id: newNodeId, name: data.memo.company.slice(0, 15), group: "memo", memoId: newMemoId }],
            links: [...prev.links, { source: newNodeId, target: "6" }] // connect to AI theme
          }));
          
          setActiveMemoId(newMemoId);
          
          setDesignerMessages(prev => [...prev, {
            role: 'ai',
            content: data.response,
            chart: data.chart || null
          }]);
        }
      } else {
        setFinanceMessages(prev => [...prev, {
          role: 'ai',
          content: data.response,
          chart: data.chart || null
        }]);
        
        if (data.memo) {
          const newMemoId = "new_memo_" + Date.now();
          setMemos(prev => ({
            ...prev,
            [newMemoId]: data.memo
          }));

          const newNodeId = "node_" + Date.now();
          setGraphData(prev => ({
            nodes: [...prev.nodes, { id: newNodeId, name: data.memo.company.slice(0, 15), group: "memo", memoId: newMemoId }],
            links: [...prev.links, { source: newNodeId, target: "6" }] // connect to AI theme
          }));
          setActiveMemoId(newMemoId);
        }
      }
    } catch (e) {
      activeSetter(prev => [...prev, {
        role: 'ai',
        content: type === 'designer'
          ? "I encountered an error while synthesizing the research. Please ensure my API key is valid."
          : "I encountered an error while running the numbers. Please ensure my API key is valid."
      }]);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-screen-container">
        {/* Animated Cyber backdrop */}
        <div className="login-cyber-grid"></div>
        <div className="login-backdrop-glow"></div>
        
        {/* Falling lights / Data streams */}
        <div className="falling-lights-container">
          <div className="light-stream" style={{ left: "10%", animationDelay: "0s", animationDuration: "8s" } as React.CSSProperties}></div>
          <div className="light-stream" style={{ left: "25%", animationDelay: "2s", animationDuration: "11s" } as React.CSSProperties}></div>
          <div className="light-stream" style={{ left: "45%", animationDelay: "1s", animationDuration: "9s" } as React.CSSProperties}></div>
          <div className="light-stream" style={{ left: "60%", animationDelay: "4s", animationDuration: "12s" } as React.CSSProperties}></div>
          <div className="light-stream" style={{ left: "80%", animationDelay: "3s", animationDuration: "10s" } as React.CSSProperties}></div>
          <div className="light-stream" style={{ left: "95%", animationDelay: "5s", animationDuration: "7s" } as React.CSSProperties}></div>

          <div className="light-particle" style={{ left: "15%", animationDelay: "0.5s", animationDuration: "5s" } as React.CSSProperties}></div>
          <div className="light-particle" style={{ left: "30%", animationDelay: "2.5s", animationDuration: "7s" } as React.CSSProperties}></div>
          <div className="light-particle" style={{ left: "40%", animationDelay: "1.2s", animationDuration: "4s" } as React.CSSProperties}></div>
          <div className="light-particle" style={{ left: "55%", animationDelay: "3.8s", animationDuration: "6s" } as React.CSSProperties}></div>
          <div className="light-particle" style={{ left: "70%", animationDelay: "0.2s", animationDuration: "8s" } as React.CSSProperties}></div>
          <div className="light-particle" style={{ left: "85%", animationDelay: "2.1s", animationDuration: "5s" } as React.CSSProperties}></div>
          <div className="light-particle" style={{ left: "92%", animationDelay: "4.7s", animationDuration: "6.5s" } as React.CSSProperties}></div>
        </div>

        <div className="login-container-split">
          {/* Left Hero Pane (Enterprise Cockpit Status Visualizer) */}
          <div className="login-hero-pane">
            <div className="login-hero-glow"></div>
            <div className="login-hero-header">
              <div className="login-logo-large">
                Nexus<span className="brand-highlight">Finance</span>.AI
              </div>
              <div className="login-subtitle-large">Institutional-Grade Buy-Side Cockpit</div>
            </div>

            <div className="login-hero-desc">
              Connect to the secure data lake. Synthesize, analyze, and build coverage memos in a unified, multi-pane quantitative workstation.
            </div>

            {/* Structured Telemetry Widgets representing enterprise "mass and moderation" */}
            <div className="telemetry-widgets">
              <div className="telemetry-card">
                <div className="telemetry-icon">📡</div>
                <div className="telemetry-info">
                  <div className="telemetry-title">System Status</div>
                  <div className="telemetry-value active-green">
                    <span className="pulse-dot"></span> SECURE CONNECTED
                  </div>
                </div>
              </div>

              <div className="telemetry-card">
                <div className="telemetry-icon">🔒</div>
                <div className="telemetry-info">
                  <div className="telemetry-title">Encryption Tunnel</div>
                  <div className="telemetry-value text-accent-secondary">AES-256 GCM</div>
                </div>
              </div>

              <div className="telemetry-card">
                <div className="telemetry-icon">🧠</div>
                <div className="telemetry-info">
                  <div className="telemetry-title">Nexus Synthesis Engine</div>
                  <div className="telemetry-value text-violet">Active Llama-3.3</div>
                </div>
              </div>
            </div>

            <div className="login-footer-info">
              <span>IP Verified: 127.0.0.1</span>
              <span className="footer-dot">•</span>
              <span>Client Version: v16.2.6</span>
            </div>
          </div>

          {/* Right Auth Pane (Element Plus style form) */}
          <div className="login-auth-pane">
            <div className="auth-header">
              <h3>Establish Connection</h3>
              <p>Please authorize using your security credentials.</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="login-input-group">
                <label className="login-label">Username</label>
                <div className="login-input-with-icon">
                  <span className="input-prefix-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    value="ian" 
                    disabled 
                    className="login-input disabled-input" 
                  />
                </div>
              </div>
              
              <div className="login-input-group">
                <label className="login-label">Security Key</label>
                <div className="login-input-with-icon">
                  <span className="input-prefix-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <div className="login-password-wrapper">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={passwordInput} 
                      onChange={e => setPasswordInput(e.target.value)} 
                      placeholder="Enter security key..." 
                      className="login-input"
                      autoFocus
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="auth-helper-text">
                Hint: Use default security key <code className="highlight-code">1234</code>
              </div>
              
              {loginError && (
                <div className="login-error-card">
                  <span className="error-icon">⚠️</span>
                  <span className="error-text">{loginError}</span>
                </div>
              )}
              
              <button type="submit" className="login-btn-large">
                <span>Access Cockpit</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-arrow-icon">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="nexus-app">
      {/* Pane 1: Sidebar (Chat & Files) */}
      <Sidebar 
        activeMemoId={activeMemoId} 
        onSelectMemo={handleSelectMemo} 
        assistantType={assistantType}
        setAssistantType={setAssistantType}
        designerMessages={designerMessages}
        financeMessages={financeMessages}
        onSend={handleGenerate}
        memos={memos}
        onLogout={() => {
          setIsLoggedIn(false);
          setPasswordInput("");
        }}
        activeMobileView={activeMobileView}
      />

      {/* Pane 2: Knowledge Graph (3D) */}
      <div className={`nexus-pane graph-container mobile-view-pane ${activeMobileView === 'graph' ? 'active-mobile-pane' : ''} ${isGraphFullscreen ? "fullscreen" : ""}`}>
        <div className="pane-header pane-header-layout">
          <div className="pane-header-left">
            <div className="tab active">
              <span className="icon">🕸️</span> Nexus Graph
            </div>
            <div className="graph-stats-badge">
              <span className="stats-dot"></span>
              <span>{graphData.nodes.length} Nodes</span>
              <span className="stats-divider">|</span>
              <span>{graphData.links.length} Links</span>
            </div>
          </div>
          <button 
            className="expand-graph-btn" 
            onClick={() => setIsGraphFullscreen(!isGraphFullscreen)}
            title={isGraphFullscreen ? "Minimize Graph" : "Maximize Graph"}
          >
            {isGraphFullscreen ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3m11-11L21 3m-11 11L3 21" />
              </svg>
            )}
          </button>
        </div>
        <div className="pane-content relative">
          <GraphView data={graphData} onNodeClick={handleNodeClick} activeMemoId={activeMemoId} />
          
          <div className="graph-controls">
            <div className="legend-item"><span className="dot memo"></span> Memos</div>
            <div className="legend-item"><span className="dot company"></span> Entities</div>
            <div className="legend-item"><span className="dot framework"></span> Concepts</div>
          </div>
        </div>
      </div>

      {/* Pane 3: Document Viewer */}
      <div className={`nexus-pane document-container mobile-view-pane ${activeMobileView === 'document' ? 'active-mobile-pane' : ''}`}>
        <div className="pane-header pane-header-layout">
          <div className="pane-header-left">
            <div className="tab active">
              <span className="icon">📄</span> Research Document
            </div>
            {activeMemoId && memos[activeMemoId] && (
              <div className="doc-meta-badge">
                <span className="doc-meta-dot"></span>
                <span>{memos[activeMemoId].framework}</span>
              </div>
            )}
          </div>
          {activeMemoId && memos[activeMemoId] ? (
            <div className="pane-header-badge loaded">
              <span className="badge-dot green"></span>
              <span className="badge-text">{memos[activeMemoId].company} Loaded</span>
            </div>
          ) : (
            <div className="pane-header-badge empty">
              <span className="badge-dot gray"></span>
              <span className="badge-text">No File Loaded</span>
            </div>
          )}
        </div>
        <div className="pane-content">
          {activeMemoId ? (
            <DocumentView memo={memos[activeMemoId]} />
          ) : (
            <div className="empty-state">Select a node or file to view the document.</div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="mobile-nav-bar">
        <button 
          className={`mobile-nav-item ${activeMobileView === 'assistant' ? 'active' : ''}`}
          onClick={() => setActiveMobileView('assistant')}
        >
          <span className="icon">💬</span>
          <span>Assistant</span>
        </button>
        <button 
          className={`mobile-nav-item ${activeMobileView === 'graph' ? 'active' : ''}`}
          onClick={() => setActiveMobileView('graph')}
        >
          <span className="icon">🕸️</span>
          <span>Graph</span>
        </button>
        <button 
          className={`mobile-nav-item ${activeMobileView === 'document' ? 'active' : ''}`}
          onClick={() => setActiveMobileView('document')}
        >
          <span className="icon">📄</span>
          <span>Document</span>
        </button>
      </div>
    </main>
  );
}
