import { Document, Packer, Paragraph, TextRun, HeadingLevel, TableOfContents, AlignmentType, BorderStyle } from 'docx';
import { readFileSync, writeFileSync } from 'fs';

const mdContent = readFileSync('30_Companies/NFLX/IC_Memo.md', 'utf-8');

// Parse markdown into document elements
const lines = mdContent.split('\n');
const children = [];

let inCodeBlock = false;
let codeBlockContent = [];
let currentList = [];
let listLevel = 0;

function flushList() {
  if (currentList.length > 0) {
    currentList.forEach(item => children.push(item));
    currentList = [];
  }
}

function parseInlineFormatting(text) {
  const runs = [];
  let remaining = text;
  
  // Process bold, italic, and combined
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|_(.+?)_|`(.+?)`)/g;
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      runs.push(new TextRun({ text: text.slice(lastIndex, match.index) }));
    }
    
    if (match[2]) { // Bold + italic
      runs.push(new TextRun({ text: match[2], bold: true, italics: true }));
    } else if (match[3]) { // Bold
      runs.push(new TextRun({ text: match[3], bold: true }));
    } else if (match[4]) { // Italic with *
      runs.push(new TextRun({ text: match[4], italics: true }));
    } else if (match[5]) { // Italic with _
      runs.push(new TextRun({ text: match[5], italics: true }));
    } else if (match[6]) { // Code
      runs.push(new TextRun({ text: match[6], font: 'Courier New', size: 20 }));
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    runs.push(new TextRun({ text: text.slice(lastIndex) }));
  }
  
  return runs.length > 0 ? runs : [new TextRun({ text })];
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Code blocks
  if (line.startsWith('```')) {
    if (inCodeBlock) {
      flushList();
      children.push(new Paragraph({
        children: [new TextRun({ text: codeBlockContent.join('\n'), font: 'Courier New', size: 18 })],
        shading: { fill: 'F5F5F5' },
        spacing: { before: 100, after: 100 }
      }));
      codeBlockContent = [];
      inCodeBlock = false;
    } else {
      inCodeBlock = true;
    }
    continue;
  }
  
  if (inCodeBlock) {
    codeBlockContent.push(line);
    continue;
  }
  
  // Horizontal rules
  if (line.match(/^---+$/)) {
    flushList();
    children.push(new Paragraph({
      border: { bottom: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 } },
      spacing: { before: 200, after: 200 }
    }));
    continue;
  }
  
  // Headers
  const h1Match = line.match(/^# (.+)$/);
  const h2Match = line.match(/^## (.+)$/);
  const h3Match = line.match(/^### (.+)$/);
  const h4Match = line.match(/^#### (.+)$/);
  
  if (h1Match) {
    flushList();
    children.push(new Paragraph({
      children: parseInlineFormatting(h1Match[1]),
      heading: HeadingLevel.TITLE,
      spacing: { before: 400, after: 200 }
    }));
    continue;
  }
  
  if (h2Match) {
    flushList();
    children.push(new Paragraph({
      children: parseInlineFormatting(h2Match[1]),
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 360, after: 120 }
    }));
    continue;
  }
  
  if (h3Match) {
    flushList();
    children.push(new Paragraph({
      children: parseInlineFormatting(h3Match[1]),
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 280, after: 80 }
    }));
    continue;
  }
  
  if (h4Match) {
    flushList();
    children.push(new Paragraph({
      children: parseInlineFormatting(h4Match[1]),
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 60 }
    }));
    continue;
  }
  
  // Block quotes
  if (line.startsWith('> ')) {
    flushList();
    const quoteText = line.slice(2);
    children.push(new Paragraph({
      children: parseInlineFormatting(quoteText),
      indent: { left: 720 },
      italics: true,
      border: { left: { color: '666666', space: 15, style: BorderStyle.SINGLE, size: 24 } },
      spacing: { before: 100, after: 100 }
    }));
    continue;
  }
  
  // Numbered lists
  const numberedMatch = line.match(/^(\d+)\.\s+(.+)$/);
  if (numberedMatch) {
    currentList.push(new Paragraph({
      children: parseInlineFormatting(numberedMatch[2]),
      numbering: { reference: 'numbered-list', level: 0 },
      spacing: { before: 60, after: 60 }
    }));
    continue;
  }
  
  // Bullet lists
  const bulletMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
  if (bulletMatch) {
    const indent = bulletMatch[1].length;
    const level = Math.floor(indent / 2);
    currentList.push(new Paragraph({
      children: parseInlineFormatting(bulletMatch[2]),
      bullet: { level },
      spacing: { before: 40, after: 40 }
    }));
    continue;
  }
  
  // Empty lines
  if (line.trim() === '') {
    flushList();
    continue;
  }
  
  // Regular paragraph
  flushList();
  children.push(new Paragraph({
    children: parseInlineFormatting(line),
    spacing: { before: 60, after: 60 }
  }));
}

flushList();

const doc = new Document({
  numbering: {
    config: [{
      reference: 'numbered-list',
      levels: [{
        level: 0,
        format: 'decimal',
        text: '%1.',
        alignment: AlignmentType.START,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
      }]
    }]
  },
  styles: {
    paragraphStyles: [
      {
        id: 'Normal',
        name: 'Normal',
        run: { font: 'Calibri', size: 22 }
      }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    children
  }]
});

const buffer = await Packer.toBuffer(doc);
writeFileSync('30_Companies/NFLX/NFLX_IC_Memo.docx', buffer);
console.log('Created: 30_Companies/NFLX/NFLX_IC_Memo.docx');
