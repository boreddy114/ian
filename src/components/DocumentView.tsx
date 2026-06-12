"use client";
import React, { useRef, useState, useEffect } from "react";

export default function DocumentView({ memo, isGenerating, selectedTicker }: { memo: any, isGenerating?: boolean, selectedTicker?: string }) {
  const documentRef = useRef<HTMLDivElement>(null);
  const [displayedContent, setDisplayedContent] = useState("");
  const [displayedTracker, setDisplayedTracker] = useState<string[]>([]);
  
  // Tab States
  const [activeTab, setActiveTab] = useState<'memo' | 'card' | 'log'>('memo');
  const [companyCardContent, setCompanyCardContent] = useState<string>("");
  const [thesisLogContent, setThesisLogContent] = useState<string>("");
  const [isCardAvailable, setIsCardAvailable] = useState(false);
  const [isLogAvailable, setIsLogAvailable] = useState(false);

  // Sync / Load Vault files for the current target company
  useEffect(() => {
    const ticker = memo?.company || selectedTicker;
    if (!ticker) {
      setCompanyCardContent("");
      setThesisLogContent("");
      setIsCardAvailable(false);
      setIsLogAvailable(false);
      return;
    }
    
    // Always default back to Research Memo on company switch
    setActiveTab('memo');

    // Fetch Card Content
    fetch(`/api/companies?ticker=${ticker}&file=card`)
      .then(res => res.json())
      .then(data => {
        if (data.memo) {
          setCompanyCardContent(data.memo.content);
          setIsCardAvailable(true);
        } else {
          setCompanyCardContent("");
          setIsCardAvailable(false);
        }
      })
      .catch(() => {
        setCompanyCardContent("");
        setIsCardAvailable(false);
      });

    // Fetch Log Content
    fetch(`/api/companies?ticker=${ticker}&file=log`)
      .then(res => res.json())
      .then(data => {
        if (data.memo) {
          setThesisLogContent(data.memo.content);
          setIsLogAvailable(true);
        } else {
          setThesisLogContent("");
          setIsLogAvailable(false);
        }
      })
      .catch(() => {
        setThesisLogContent("");
        setIsLogAvailable(false);
      });
  }, [memo?.company, selectedTicker]);

  useEffect(() => {
    if (isGenerating) {
      return;
    }

    if (!memo) return;

    // Fast, snappy typewriter effect for premium experience
    let currentText = "";
    const fullText = memo.content || "";
    let charIndex = 0;
    const speed = 5; // ms interval
    
    const interval = setInterval(() => {
      if (charIndex < fullText.length) {
        currentText += fullText.slice(charIndex, charIndex + 4);
        setDisplayedContent(currentText);
        charIndex += 4;
      } else {
        setDisplayedContent(fullText);
        setDisplayedTracker(memo.tracker || []);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [memo, isGenerating]);

  const generatePDF = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      if (documentRef.current) {
        const btn = documentRef.current.querySelector('.pdf-export-container') as HTMLElement;
        if (btn) btn.style.display = 'none';

        const opt = {
          margin: 1,
          filename: `${memo?.company || "N-A"}_${memo?.date || "Present"}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        } as const;

        await html2pdf().set(opt).from(documentRef.current).save();
        if (btn) btn.style.display = 'flex';
      }
    } catch (e) {
      console.error("PDF generation failed", e);
    }
  };

  const generateDOCX = () => {
    try {
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><title>Research Memo</title><style>"+
            "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }"+
            "h1 { font-family: Georgia, serif; color: #111; font-size: 24pt; margin-bottom: 12pt; }"+
            "h2 { font-family: Georgia, serif; color: #222; font-size: 16pt; margin-top: 24pt; margin-bottom: 12pt; }"+
            ".metadata { background-color: #f4f4f4; border: 1px solid #ddd; padding: 12px; margin-bottom: 18pt; }"+
            ".metadata-item { margin-bottom: 6pt; }"+
            ".label { font-weight: bold; text-transform: uppercase; font-size: 9pt; color: #666; }"+
            ".value { font-size: 11pt; }"+
            "ul { list-style-type: square; padding-left: 20px; }"+
            "li { margin-bottom: 6pt; }"+
            "</style></head><body>";
      
      const footer = "</body></html>";
      
      const content = `
        <h1>${memo?.title || "Untitled Memo"}</h1>
        <div class="metadata">
          <div class="metadata-item"><span class="label">Author:</span> <span class="value">${memo?.author || "Unknown Author"}</span></div>
          <div class="metadata-item"><span class="label">Date:</span> <span class="value">${memo?.date || "Present"}</span></div>
          <div class="metadata-item"><span class="label">Framework:</span> <span class="value">${memo?.framework || "N/A"}</span></div>
        </div>
        <h2>Context</h2>
        <p>${memo?.content || ""}</p>
        <h2>Thesis Tracker</h2>
        <ul>
          ${(memo?.tracker || []).map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
      `;
      
      const sourceHTML = header + content + footer;
      const fileBlob = new Blob(['\ufeff' + sourceHTML], { type: 'application/msword' });
      const url = URL.createObjectURL(fileBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${memo?.company || "N-A"}_${memo?.date || "Present"}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("DOCX generation failed", e);
    }
  };

  // Helper parser to format raw markdown blocks neatly
  const renderFormattedContent = (text: string) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[][] = [];
    let keyIndex = 0;

    const parseFormatting = (str: string) => {
      const parts = str.split(/\*\*([\s\S]+?)\*\*/g);
      return parts.map((part, i) => {
        if (i % 2 === 1) {
          return <strong key={i} style={{ color: '#fff', fontWeight: '600' }}>{part}</strong>;
        }
        return part;
      });
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Handle markdown table parsing
      if (line.startsWith('|')) {
        const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        
        // Skip separator line (e.g. |---|---|)
        if (cells.every(c => c.match(/^-+$/))) {
          continue;
        }
        
        if (!inTable) {
          inTable = true;
          tableHeaders = cells;
          tableRows = [];
        } else {
          tableRows.push(cells);
        }
        continue;
      } else if (inTable) {
        inTable = false;
        elements.push(
          <div key={`table_${keyIndex++}`} style={{ overflowX: 'auto', margin: '18px 0', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(56, 189, 248, 0.05)', borderBottom: '1px solid var(--border-color)' }}>
                  {tableHeaders.map((header, hIdx) => (
                    <th key={hIdx} style={{ padding: '10px 14px', fontWeight: '600', color: 'var(--accent-secondary)' }}>{parseFormatting(header)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: rIdx === tableRows.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.8)' }}>{parseFormatting(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      if (line === '') {
        elements.push(<div key={`br_${keyIndex++}`} style={{ height: '8px' }} />);
        continue;
      }

      // Headings
      if (line.startsWith('# ')) {
        elements.push(<h1 key={`h1_${keyIndex++}`} style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fff', margin: '20px 0 10px 0', fontFamily: 'Outfit, sans-serif' }}>{parseFormatting(line.slice(2))}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={`h2_${keyIndex++}`} style={{ fontSize: '1.3rem', fontWeight: '600', color: 'var(--accent-secondary)', margin: '16px 0 8px 0', fontFamily: 'Outfit, sans-serif' }}>{parseFormatting(line.slice(3))}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={`h3_${keyIndex++}`} style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fff', margin: '14px 0 6px 0', fontFamily: 'Outfit, sans-serif' }}>{parseFormatting(line.slice(4))}</h3>);
      }
      // Bullet list
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <div key={`li_${keyIndex++}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', margin: '4px 0 4px 10px', fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
            <span style={{ display: 'inline-block', width: '5px', height: '5px', minWidth: '5px', borderRadius: '50%', background: 'var(--accent-secondary)', marginTop: '6px' }}></span>
            <span>{parseFormatting(line.slice(2))}</span>
          </div>
        );
      }
      // Normal Paragraph
      else {
        elements.push(<p key={`p_${keyIndex++}`} style={{ fontSize: '13.5px', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', margin: '6px 0', textAlign: 'justify' }}>{parseFormatting(line)}</p>);
      }
    }

    // Render any trailing table
    if (inTable) {
      elements.push(
        <div key={`table_${keyIndex++}`} style={{ overflowX: 'auto', margin: '18px 0', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(56, 189, 248, 0.05)', borderBottom: '1px solid var(--border-color)' }}>
                {tableHeaders.map((header, hIdx) => (
                  <th key={hIdx} style={{ padding: '10px 14px', fontWeight: '600', color: 'var(--accent-secondary)' }}>{parseFormatting(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: rIdx === tableRows.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.8)' }}>{parseFormatting(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return <div className="formatted-doc-container">{elements}</div>;
  };

  if (!memo && !isGenerating) {
    return (
      <div className="document-pane empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
        <h3 style={{ color: '#fff', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>No Reports Generated</h3>
        <p style={{ maxWidth: '320px', fontSize: '13px', lineHeight: '1.6' }}>
          {selectedTicker 
            ? `No reports have been generated for ${selectedTicker} yet. Select a memo type chip in the Memo Builder to generate one.`
            : "Select a node on the graph or a file in the tree to load the document."
          }
        </p>
      </div>
    );
  }

  const showFullLoader = isGenerating && !memo;
  const activeCompany = memo?.company || selectedTicker || "N/A";

  return (
    <div className="document-pane" ref={documentRef} style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .doc-tabs-bar {
          display: flex;
          gap: 4px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
          padding: 0 16px;
        }
        .doc-tab {
          background: none;
          border: none;
          outline: none;
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }
        .doc-tab.active {
          color: var(--accent-secondary) !important;
          border-bottom: 2px solid var(--accent-secondary) !important;
        }
      `}</style>

      {/* Dynamic Document Tabs */}
      <div className="doc-tabs-bar">
        <button 
          onClick={() => setActiveTab('memo')}
          className={`doc-tab ${activeTab === 'memo' ? 'active' : ''}`}
          style={{ color: activeTab === 'memo' ? 'var(--accent-secondary)' : 'var(--text-muted)' }}
        >
          📄 Research Memo
        </button>
        
        <button 
          onClick={() => isCardAvailable && setActiveTab('card')}
          className={`doc-tab ${activeTab === 'card' ? 'active' : ''}`}
          style={{ 
            color: !isCardAvailable ? 'rgba(255,255,255,0.12)' : activeTab === 'card' ? 'var(--accent-secondary)' : 'var(--text-muted)', 
            cursor: isCardAvailable ? 'pointer' : 'not-allowed'
          }}
          disabled={!isCardAvailable}
        >
          📇 Company Card
        </button>
        
        <button 
          onClick={() => isLogAvailable && setActiveTab('log')}
          className={`doc-tab ${activeTab === 'log' ? 'active' : ''}`}
          style={{ 
            color: !isLogAvailable ? 'rgba(255,255,255,0.12)' : activeTab === 'log' ? 'var(--accent-secondary)' : 'var(--text-muted)', 
            cursor: isLogAvailable ? 'pointer' : 'not-allowed'
          }}
          disabled={!isLogAvailable}
        >
          📓 Thesis Log
        </button>
      </div>

      {/* Glassmorphic overlay shown on top of the old memo content during generation */}
      {isGenerating && (
        <div className="document-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 5, 10, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          zIndex: 10,
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '2px solid rgba(56, 189, 248, 0.1)',
              borderTop: '2px solid var(--accent-secondary)',
              animation: 'spin 0.8s linear infinite'
            }}></div>
            <span style={{ 
              color: 'var(--text-normal)', 
              fontSize: '14px', 
              fontWeight: '500', 
              letterSpacing: '0.02em',
              animation: 'pulseGlow 2s infinite',
              textShadow: '0 0 10px rgba(56, 189, 248, 0.4)' 
            }}>
              Nexus AI Compiling Research...
            </span>
          </div>
        </div>
      )}

      {showFullLoader ? (
        <div className="document-content" style={{ padding: '24px', flex: 1, overflowY: "auto" }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '85%', height: '24px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}></div>
            <div style={{ width: '40%', height: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }}></div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: "auto" }}>
          <div className="document-header">
            <div className="breadcrumbs">
              <span>Nexus Vault</span> / <span className="highlight-text">{activeCompany}</span> / <span className="current">
                {activeTab === 'memo' ? (memo?.title || "Research Memo") : activeTab === 'card' ? "Company Card" : "Thesis Log"}
              </span>
            </div>
            {activeTab === 'memo' && memo && (
              <div className="pdf-export-container">
                <button className="premium-btn" onClick={generatePDF}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Export PDF
                </button>
                <button className="premium-btn docx-btn" onClick={generateDOCX}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Export DOCX
                </button>
              </div>
            )}
          </div>
          
          <div className="document-content">
            {activeTab === 'memo' ? (
              <>
                <h1 className="doc-title">{memo?.title || "Untitled Memo"}</h1>
                
                <div className="premium-callout">
                  <div className="callout-grid">
                    <div className="callout-item">
                      <span className="label">Author</span>
                      <span className="value">{memo?.author || "Nexus AI Analyst"}</span>
                    </div>
                    <div className="callout-item">
                      <span className="label">Date</span>
                      <span className="value">{memo?.date || "Present"}</span>
                    </div>
                    <div className="callout-item">
                      <span className="label">Framework</span>
                      <span className="value highlight-text">{memo?.framework || "N/A"}</span>
                    </div>
                  </div>
                </div>
                
                <h2 className="section-title">Context</h2>
                <p className="doc-paragraph">{displayedContent}</p>
                
                <h2 className="section-title">Thesis Tracker</h2>
                <div className="gradient-divider"></div>
                
                <div className="premium-list">
                  <ul>
                    {displayedTracker.map((item: string, index: number) => (
                      <li key={index} style={{ animation: 'fadeInUp 0.4s ease forwards', animationDelay: `${index * 120}ms`, opacity: 0 }}>
                        <span className="list-bullet"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : activeTab === 'card' ? (
              <div style={{ animation: 'fadeInUp 0.4s ease forwards' }}>
                {renderFormattedContent(companyCardContent)}
              </div>
            ) : (
              <div style={{ animation: 'fadeInUp 0.4s ease forwards' }}>
                {renderFormattedContent(thesisLogContent)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
