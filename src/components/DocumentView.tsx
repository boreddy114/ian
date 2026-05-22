"use client";

import React, { useRef } from "react";

export default function DocumentView({ memo }: { memo: any }) {
  const documentRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      if (documentRef.current) {
        const btn = documentRef.current.querySelector('.pdf-export-container') as HTMLElement;
        if (btn) btn.style.display = 'none';

        const opt = {
          margin: 1,
          filename: `${memo.company || "N-A"}_${memo.date || "Present"}.pdf`,
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
        <h1>${memo.title || "Untitled Memo"}</h1>
        <div class="metadata">
          <div class="metadata-item"><span class="label">Author:</span> <span class="value">${memo.author || "Unknown Author"}</span></div>
          <div class="metadata-item"><span class="label">Date:</span> <span class="value">${memo.date || "Present"}</span></div>
          <div class="metadata-item"><span class="label">Framework:</span> <span class="value">${memo.framework || "N/A"}</span></div>
        </div>
        <h2>Context</h2>
        <p>${memo.content || ""}</p>
        <h2>Thesis Tracker</h2>
        <ul>
          ${(memo.tracker || []).map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
      `;
      
      const sourceHTML = header + content + footer;
      const fileBlob = new Blob(['\ufeff' + sourceHTML], { type: 'application/msword' });
      const url = URL.createObjectURL(fileBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${memo.company || "N-A"}_${memo.date || "Present"}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("DOCX generation failed", e);
    }
  };

  return (
    <div className="document-pane" ref={documentRef}>
      <div className="document-header">
        <div className="breadcrumbs">
          <span>Nexus Vault</span> / <span className="highlight-text">{memo.company || "N/A"}</span> / <span className="current">{memo.title || "Untitled Memo"}</span>
        </div>
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
      </div>
      
      <div className="document-content">
        <h1 className="doc-title">{memo.title || "Untitled Memo"}</h1>
        
        <div className="premium-callout">
          <div className="callout-grid">
            <div className="callout-item">
              <span className="label">Author</span>
              <span className="value">{memo.author || "Unknown Author"}</span>
            </div>
            <div className="callout-item">
              <span className="label">Date</span>
              <span className="value">{memo.date || "Present"}</span>
            </div>
            <div className="callout-item">
              <span className="label">Framework</span>
              <span className="value highlight-text">{memo.framework || "N/A"}</span>
            </div>
          </div>
        </div>
        
        <h2 className="section-title">Context</h2>
        <p className="doc-paragraph">{memo.content || ""}</p>
        
        <h2 className="section-title">Thesis Tracker</h2>
        <div className="gradient-divider"></div>
        
        <div className="premium-list">
          <ul>
            {(memo.tracker || []).map((item: string, index: number) => (
              <li key={index}>
                <span className="list-bullet"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
