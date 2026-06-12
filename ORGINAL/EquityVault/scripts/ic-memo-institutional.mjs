import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const WORK_DIR = '/tmp/docx-build';
const TEMPLATE = '00_Templates/IC_Memo_Template.dotx';
const OUTPUT = '30_Companies/NFLX/Outputs/NFLX_IC_Memo_2026-02-21.docx';

// Clean and setup
rmSync(WORK_DIR, { recursive: true, force: true });
mkdirSync(WORK_DIR, { recursive: true });
execSync(`unzip -q "${TEMPLATE}" -d "${WORK_DIR}"`);

// XML helpers
function esc(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

let paraId = 0x20000000;
function pid() { return (paraId++).toString(16).toUpperCase().padStart(8, '0'); }

// Parse inline: **bold**, *italic*
function inline(text) {
  let result = '';
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let last = 0, m;
  
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) {
      result += `<w:r><w:t xml:space="preserve">${esc(text.slice(last, m.index))}</w:t></w:r>`;
    }
    if (m[2]) { // bold
      result += `<w:r><w:rPr><w:b/></w:rPr><w:t>${esc(m[2])}</w:t></w:r>`;
    } else if (m[3]) { // italic
      result += `<w:r><w:rPr><w:i/></w:rPr><w:t>${esc(m[3])}</w:t></w:r>`;
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    result += `<w:r><w:t xml:space="preserve">${esc(text.slice(last))}</w:t></w:r>`;
  }
  return result || `<w:r><w:t>${esc(text)}</w:t></w:r>`;
}

function h1(text) {
  return `<w:p w14:paraId="${pid()}" w14:textId="${pid()}"><w:pPr><w:pStyle w:val="Heading1"/></w:pPr>${inline(text)}</w:p>`;
}

function h2(text) {
  return `<w:p w14:paraId="${pid()}" w14:textId="${pid()}"><w:pPr><w:pStyle w:val="Heading2"/></w:pPr>${inline(text)}</w:p>`;
}

function p(text) {
  return `<w:p w14:paraId="${pid()}" w14:textId="${pid()}">${inline(text)}</w:p>`;
}

function blank() {
  return `<w:p w14:paraId="${pid()}" w14:textId="${pid()}"/>`;
}

function bullet(text) {
  return `<w:p w14:paraId="${pid()}" w14:textId="${pid()}"><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr>${inline(text)}</w:p>`;
}

// ============================================================
// INSTITUTIONAL MEMO CONTENT
// ============================================================

const paragraphs = [];

paragraphs.push(h1('Thesis'));

paragraphs.push(p("**Digital scarcity in an abundance world.** The WBD IP catalog—Harry Potter, DC, Game of Thrones, the HBO library—functions as a 50-year land bank. These are durable, irreplaceable assets that fit our Physical Tether framework even without physical infrastructure. In an AI era flooding the market with synthetic content, authentic human storytelling becomes more scarce, not less."));

paragraphs.push(p("**Non-extractive positioning creates runway.** Netflix's cost per viewing hour (~$0.14) runs 3-4x cheaper than competitors ($0.40-0.50). Per the Marathon framework, companies that create more value than they capture have long growth runways. Netflix has stored optionality to extract more over time without breaking the value proposition."));

paragraphs.push(p("**Aggregator of premium narrative content.** The Internet inverted Hollywood economics: distribution is now more scalable than content. Netflix is becoming the Amazon of storytelling—the aggregator that monetizes any content better than alternatives. The WBD deal completes this positioning."));

paragraphs.push(p("**The real competition is YouTube, not legacy studios.** YouTube has surpassed Netflix in total TV viewing time with content acquired for free. The WBD deal represents consolidation of premium narrative to compete against infinite free UGC—not Netflix crushing Hollywood, but Netflix rallying Hollywood to survive."));

paragraphs.push(p("**Shared experiences command premium in AI abundance.** When AI individualizes everything, common cultural touchstones become more valuable. Live events (NFL, WWE), cultural moments, and beloved franchises create shared experiences AI cannot replicate."));

paragraphs.push(p("**Expectations are compressed.** At ~29x forward earnings vs. a 5-year average of ~35x, the standalone business (20% EPS CAGR) is priced for modest outcomes. The WBD deal uncertainty creates a discounted entry point."));

paragraphs.push(blank());
paragraphs.push(h1('What Changed'));

paragraphs.push(p("The prior decade disrupted content distribution—Netflix beat cable. The next decade will disrupt content creation. AI text-to-video tools (Sora, Runway, VEO) are democratizing high-quality production. YouTube now commands 10%+ of TV screen time. The creator economy's share of total media revenue has doubled."));

paragraphs.push(p("The traditional content moat—$100-150M production budgets, expensive studios, unionized talent—is being commoditized. AI can match production quality at a fraction of the cost. Open-source models can create comparable video at 10% of training costs."));

paragraphs.push(p('But storytelling talent remains scarce. As Netflix co-CEO Greg Peters noted: "The skill at storytelling at the highest level in the human population, I think of that as a fairly rare commodity." Production efficiency is independent of storytelling quality—"you can have very highly produced terrible content."'));

paragraphs.push(p("YouTube represents the existential challenge: how do you compete with infinite free content? The answer lies in what YouTube lacks. Library content has longevity UGC does not—people still watch Friends, Grey's Anatomy, Gunsmoke. Professional content creates cultural moments everyone can discuss. In a world of AI slop, verified human storytelling becomes a differentiator."));

paragraphs.push(p('Ben Thompson\'s framing captures it: "The real threat to Hollywood isn\'t (just) that the Internet made distribution free, favoring the Aggregators; it\'s that technology has made it possible for anyone to create content, and the threat isn\'t theoretical: it\'s winning in the market." The WBD deal isn\'t Netflix vs. Hollywood. It\'s Netflix consolidating Hollywood to compete against the real enemy: infinite free AI-generated content.'));

paragraphs.push(blank());
paragraphs.push(h1('Variant View'));

paragraphs.push(h2('Bear Case #1: Netflix is a content company facing AI disruption'));

paragraphs.push(p("**The market is applying the wrong framework.** Netflix isn't in the content creation business—it's in the content distribution business. AI disrupts production; it enhances distribution. The real power goes to the aggregator. Amazon didn't make products; it aggregated them. YouTube didn't create videos; it aggregated them. Netflix's moat is aggregation, not production. The WBD deal strengthens this: Netflix acquires proven IP and monetizes it through superior distribution."));

paragraphs.push(h2('Bear Case #2: The WBD deal is empire-building'));

paragraphs.push(p("**It's defensive consolidation against the real threat.** The market sees Netflix overpaying for a troubled asset. But the strategic context differs from AT&T's failed acquisition. AT&T was a telecom trying to vertically integrate content with no synergy. Netflix is an aggregator acquiring supply to compete with infinite free UGC. YouTube can always have more new content. Netflix needs durable content—library IP with longevity. Harry Potter, GoT, and DC are irreplaceable. Generic Netflix Originals are not."));

paragraphs.push(h2('Bear Case #3: Engagement is stalling'));

paragraphs.push(p('**Engagement growth matters less than engagement monetization.** Netflix\'s revenue per engagement is the lowest among streaming peers—which is bullish, not bearish. Current engagement is under-monetized. The advertising ramp ($3B to $8.5B by 2030e) captures more value per hour. Pricing power exists; churn post-hikes has been "modest and temporary." Peters notes: "All hours are not created equal." Netflix is building models to understand which hours are more valuable and monetize accordingly.'));

paragraphs.push(h2('Bear Case #4: Multiple compression from tech to media'));

paragraphs.push(p("**Netflix is the platform; leverage is temporary.** The market is repricing Netflix from 35x (tech) to 15x (media). But the comparison should be Amazon, not Disney. Amazon took on debt for scale acquisitions (Whole Foods, MGM). The platform value justified the leverage. Netflix's aggregator position justifies the same math. If the WBD deal falls through, Netflix returns to net cash glide path and capital returns narrative. If it closes successfully, Netflix owns the premium narrative aggregator with irreplaceable IP. Either outcome is better than current pricing implies."));

paragraphs.push(h2('Bear Case #5: AI will commoditize storytelling'));

paragraphs.push(p("**AI commoditizes production, not storytelling.** The market conflates production capability with storytelling quality. In a world of AI-mediated everything, things that can't get measured fall by the wayside—utilitarian goods with no soul. AI can produce video. It cannot produce culturally-embedded franchises with 25+ years of brand equity, shared experiences that create water cooler moments, or authentic human storytelling that audiences trust. In abundance, authenticity becomes the scarcity. WBD IP is verified, beloved, irreplaceable human creation."));

paragraphs.push(blank());
paragraphs.push(h1('Catalysts'));

paragraphs.push(bullet("**DD revenue growth:** Ad tier scaling from $3B to $8.5B by 2030e, international expansion, demonstrated pricing power"));
paragraphs.push(bullet("**Operating leverage:** Content spend falls from 42% to 32% of revenue by 2030e while absolute spend grows—~1,000bps EBITDA margin expansion"));
paragraphs.push(bullet("**FCF conversion:** 20% FCF margin (2025e) expanding to 33% (2030e)"));
paragraphs.push(bullet("**WBD synergies:** Library monetization, theatrical integration, HBO quality infusion"));
paragraphs.push(bullet("**Capital returns:** If WBD deal fails, Netflix returns to net cash and buyback narrative"));

paragraphs.push(blank());
paragraphs.push(h1('Risks'));

paragraphs.push(bullet("**WBD execution:** Netflix has never done a deal this size. Integration risk is real and timeline extends 12-18 months."));
paragraphs.push(bullet("**Regulatory overhang:** Potential pushback on content exclusivity arrangements could force divestitures or behavioral remedies."));
paragraphs.push(bullet("**YouTube threat acceleration:** If UGC quality improves faster than expected via AI tools, the premium content moat narrows."));
paragraphs.push(bullet("**Churn sensitivity:** Price hikes could hit demand harder than modeled in a recession scenario."));
paragraphs.push(bullet("**Leverage concerns:** Pro forma debt load may limit strategic flexibility if streaming economics deteriorate."));

paragraphs.push(blank());
paragraphs.push(p("**Rating:** Under Review pending WBD deal clarity."));

const content = paragraphs.join('\n');

// Build document
const templateDoc = readFileSync(join(WORK_DIR, 'word/document.xml'), 'utf-8');
const nsMatch = templateDoc.match(/<w:document[^>]*>/);
const docStart = nsMatch ? nsMatch[0] : '<w:document>';
const sectPrMatch = templateDoc.match(/<w:sectPr[\s\S]*?<\/w:sectPr>/);
const sectPr = sectPrMatch ? sectPrMatch[0] : '';

const newDoc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
${docStart}
  <w:body>
    ${content}
    ${sectPr}
  </w:body>
</w:document>`;

writeFileSync(join(WORK_DIR, 'word/document.xml'), newDoc);

// Fix content types for .docx
const ct = readFileSync(join(WORK_DIR, '[Content_Types].xml'), 'utf-8');
writeFileSync(join(WORK_DIR, '[Content_Types].xml'), ct.replace(/template\.main/g, 'document.main'));

// Package
execSync(`cd "${WORK_DIR}" && zip -q -r output.docx . -x "*.DS_Store"`);
cpSync(join(WORK_DIR, 'output.docx'), OUTPUT);

console.log(`Created: ${OUTPUT}`);
rmSync(WORK_DIR, { recursive: true, force: true });
