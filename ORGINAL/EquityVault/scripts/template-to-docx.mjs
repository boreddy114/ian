import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const WORK_DIR = '/tmp/docx-build';
const TEMPLATE = '00_Templates/IC_Memo_Template.dotx';
const OUTPUT = '30_Companies/NFLX/NFLX_IC_Memo_2026_02_21.docx';

// Clean and setup work directory
rmSync(WORK_DIR, { recursive: true, force: true });
mkdirSync(WORK_DIR, { recursive: true });

// Extract template
execSync(`unzip -q "${TEMPLATE}" -d "${WORK_DIR}"`);

// Read the markdown content
const md = readFileSync('30_Companies/NFLX/IC_Memo.md', 'utf-8');

// XML escaping
function esc(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Generate unique IDs
let paraIdCounter = 0x10000000;
function newParaId() {
  return (paraIdCounter++).toString(16).toUpperCase().padStart(8, '0');
}

// Parse inline formatting and return w:r elements
function parseInline(text) {
  let result = '';
  let remaining = text;
  
  // Process patterns: ***bold+italic***, **bold**, *italic*, `code`
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result += `<w:r><w:t xml:space="preserve">${esc(text.slice(lastIndex, match.index))}</w:t></w:r>`;
    }
    
    if (match[2]) { // Bold + italic
      result += `<w:r><w:rPr><w:b/><w:i/></w:rPr><w:t>${esc(match[2])}</w:t></w:r>`;
    } else if (match[3]) { // Bold
      result += `<w:r><w:rPr><w:b/></w:rPr><w:t>${esc(match[3])}</w:t></w:r>`;
    } else if (match[4]) { // Italic
      result += `<w:r><w:rPr><w:i/></w:rPr><w:t>${esc(match[4])}</w:t></w:r>`;
    } else if (match[5]) { // Code
      result += `<w:r><w:rPr><w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/><w:sz w:val="20"/></w:rPr><w:t>${esc(match[5])}</w:t></w:r>`;
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < text.length) {
    result += `<w:r><w:t xml:space="preserve">${esc(text.slice(lastIndex))}</w:t></w:r>`;
  }
  
  return result || `<w:r><w:t>${esc(text)}</w:t></w:r>`;
}

// Create paragraph with style
function para(text, style = null) {
  const id = newParaId();
  let pPr = '';
  if (style) {
    pPr = `<w:pPr><w:pStyle w:val="${style}"/></w:pPr>`;
  }
  return `<w:p w14:paraId="${id}" w14:textId="${id}">${pPr}${parseInline(text)}</w:p>`;
}

// Create empty paragraph
function emptyPara() {
  return `<w:p w14:paraId="${newParaId()}" w14:textId="${newParaId()}"/>`;
}

// Create list item paragraph
function listItem(text, numbered = false) {
  const id = newParaId();
  const numId = numbered ? '1' : '2'; // Assumes template has numbering definitions
  return `<w:p w14:paraId="${id}" w14:textId="${id}">
    <w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="${numId}"/></w:numPr></w:pPr>
    ${parseInline(text)}
  </w:p>`;
}

// Create blockquote paragraph
function blockquote(text) {
  const id = newParaId();
  return `<w:p w14:paraId="${id}" w14:textId="${id}">
    <w:pPr><w:pStyle w:val="Quote"/></w:pPr>
    ${parseInline(text)}
  </w:p>`;
}

// Parse markdown sections
function parseMarkdownSection(content) {
  const lines = content.split('\n');
  let xml = '';
  let inCodeBlock = false;
  let codeLines = [];
  let consecutiveQuotes = [];
  
  function flushQuotes() {
    if (consecutiveQuotes.length > 0) {
      xml += blockquote(consecutiveQuotes.join(' '));
      consecutiveQuotes = [];
    }
  }
  
  for (const line of lines) {
    // Code blocks
    if (line.startsWith('```')) {
      flushQuotes();
      if (inCodeBlock) {
        xml += para(codeLines.join('\n'));
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }
    
    // Skip horizontal rules
    if (line.match(/^---+$/)) {
      flushQuotes();
      continue;
    }
    
    // Headers (map to template heading styles)
    const h2 = line.match(/^## (.+)$/);
    const h3 = line.match(/^### (.+)$/);
    const h4 = line.match(/^#### (.+)$/);
    
    if (h2) {
      flushQuotes();
      xml += para(h2[1], 'Heading1');
      continue;
    }
    if (h3) {
      flushQuotes();
      xml += para(h3[1], 'Heading2');
      continue;
    }
    if (h4) {
      flushQuotes();
      xml += para(h4[1], 'Heading3');
      continue;
    }
    
    // Blockquotes - accumulate consecutive lines
    if (line.startsWith('> ')) {
      consecutiveQuotes.push(line.slice(2));
      continue;
    } else {
      flushQuotes();
    }
    
    // Numbered lists
    const numMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (numMatch) {
      xml += listItem(numMatch[2], true);
      continue;
    }
    
    // Bullet lists
    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      xml += listItem(bulletMatch[1], false);
      continue;
    }
    
    // Empty lines
    if (line.trim() === '') {
      xml += emptyPara();
      continue;
    }
    
    // Regular paragraph
    xml += para(line);
  }
  
  flushQuotes();
  return xml;
}

// Extract sections from IC Memo
function extractSections(markdown) {
  const sections = {
    thesis: '',
    whatChanged: '',
    variantView: '',
    catalysts: '',
    risks: ''
  };
  
  // Find Executive Summary for Thesis
  const execSummaryMatch = markdown.match(/## Executive Summary\n([\s\S]*?)(?=\n## I\.|$)/);
  if (execSummaryMatch) {
    sections.thesis = execSummaryMatch[1].trim();
  }
  
  // Section I for What Changed
  const sec1Match = markdown.match(/## I\. The Strategic Landscape[\s\S]*?([\s\S]*?)(?=\n## II\.|$)/);
  if (sec1Match) {
    sections.whatChanged = sec1Match[1].trim();
  }
  
  // Section II + III for Variant View
  const sec2Match = markdown.match(/## II\. Netflix's Strategic Response([\s\S]*?)(?=\n## III\.|$)/);
  const sec3Match = markdown.match(/## III\. Reframing the Bear Case([\s\S]*?)(?=\n## IV\.|$)/);
  if (sec2Match || sec3Match) {
    sections.variantView = (sec2Match ? sec2Match[1] : '') + '\n\n' + (sec3Match ? sec3Match[1] : '');
    sections.variantView = sections.variantView.trim();
  }
  
  // Section IV - Bull Case for Catalysts, Risks for Risks
  const bullCaseMatch = markdown.match(/### Bull Case Drivers([\s\S]*?)(?=\n### Key Risks|$)/);
  const risksMatch = markdown.match(/### Key Risks([\s\S]*?)(?=\n### Position Sizing|$)/);
  
  if (bullCaseMatch) {
    sections.catalysts = bullCaseMatch[1].trim();
  }
  if (risksMatch) {
    sections.risks = risksMatch[1].trim();
  }
  
  return sections;
}

// Build document body
const sections = extractSections(md);

// Read and extract document namespaces from template
const templateDoc = readFileSync(join(WORK_DIR, 'word/document.xml'), 'utf-8');
const nsMatch = templateDoc.match(/<w:document[^>]*>/);
const docStart = nsMatch ? nsMatch[0] : '<w:document>';

// Read sectPr from template (page settings, headers, footers)
const sectPrMatch = templateDoc.match(/<w:sectPr[\s\S]*?<\/w:sectPr>/);
const sectPr = sectPrMatch ? sectPrMatch[0] : '';

// Build new document.xml
const newDoc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
${docStart}
  <w:body>
    ${para('Thesis', 'Heading1')}
    ${parseMarkdownSection(sections.thesis)}
    ${emptyPara()}
    ${para('What Changed', 'Heading1')}
    ${parseMarkdownSection(sections.whatChanged)}
    ${emptyPara()}
    ${para('Variant View', 'Heading1')}
    ${parseMarkdownSection(sections.variantView)}
    ${emptyPara()}
    ${para('Catalysts', 'Heading1')}
    ${parseMarkdownSection(sections.catalysts)}
    ${emptyPara()}
    ${para('Risks', 'Heading1')}
    ${parseMarkdownSection(sections.risks)}
    ${sectPr}
  </w:body>
</w:document>`;

// Write updated document.xml
writeFileSync(join(WORK_DIR, 'word/document.xml'), newDoc);

// Change Content_Types to docx instead of dotx
const contentTypes = readFileSync(join(WORK_DIR, '[Content_Types].xml'), 'utf-8');
const updatedContentTypes = contentTypes.replace(/template\.main/g, 'document.main');
writeFileSync(join(WORK_DIR, '[Content_Types].xml'), updatedContentTypes);

// Repackage as docx
execSync(`cd "${WORK_DIR}" && zip -q -r output.docx . -x "*.DS_Store"`);
cpSync(join(WORK_DIR, 'output.docx'), OUTPUT);

console.log(`Created: ${OUTPUT}`);

// Cleanup
rmSync(WORK_DIR, { recursive: true, force: true });
