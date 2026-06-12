import { NextResponse } from 'next/server';
import { readdirSync, readFileSync, statSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryTicker = searchParams.get('ticker');
    const queryFile = searchParams.get('file'); // 'card' | 'log'
    
    const vaultPath = '/Users/homefolder/Downloads/ian/ORGINAL/EquityVault/30_Companies';
    
    if (queryTicker && queryFile) {
      const companyPath = join(vaultPath, queryTicker);
      const filename = queryFile === 'card' ? 'Company_Card.md' : 'Thesis_Log.md';
      const filePath = join(companyPath, filename);
      
      if (!existsSync(filePath)) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
      
      const fileContent = readFileSync(filePath, 'utf8');
      
      // Return in the format expected by DocumentView.tsx
      return NextResponse.json({
        memo: {
          title: `${queryTicker} ${queryFile === 'card' ? 'Company Card' : 'Thesis Log'}`,
          author: "EquityVault Database",
          date: "Present",
          company: queryTicker,
          framework: queryFile === 'card' ? 'Company Overview' : 'Thesis Development Log',
          content: fileContent,
          tracker: queryFile === 'card' 
            ? ["Double click nodes to focus", "Adjust criteria via Memo Builder"]
            : ["Logged thesis changes over time", "Evidence-anchored analytical log"]
        }
      });
    }

    if (!existsSync(vaultPath)) {
      return NextResponse.json({ companies: [] });
    }

    const items = readdirSync(vaultPath);
    const companies = [];

    for (const item of items) {
      if (item === '.DS_Store') continue;
      const fullPath = join(vaultPath, item);
      if (statSync(fullPath).isDirectory()) {
        const ticker = item;
        let name = ticker;
        let sector = 'Technology';
        let subSector = 'Software & Services';
        let rating = 'Under Review';
        const cardPath = join(fullPath, 'Company_Card.md');
        
        if (existsSync(cardPath)) {
          try {
            const content = readFileSync(cardPath, 'utf8');
            const match = content.match(/\|\s*\*\*Company\*\*\s*\|\s*([^|]+)\s*\|/i);
            if (match && match[1]) {
              name = match[1].trim();
            } else {
              const headingMatch = content.match(/#\s*[^-–—\n]+[-–—]\s*(.+)/);
              if (headingMatch && headingMatch[1]) {
                name = headingMatch[1].trim().replace(/\s*Company\s*Card/i, '').trim();
              }
            }
            
            const sectorMatch = content.match(/\|\s*\*\*Sector\*\*\s*\|\s*([^|]+)\s*\|/i);
            if (sectorMatch && sectorMatch[1]) {
              sector = sectorMatch[1].trim();
            }
            const subSectorMatch = content.match(/\|\s*\*\*Sub-Sector\*\*\s*\|\s*([^|]+)\s*\|/i);
            if (subSectorMatch && subSectorMatch[1]) {
              subSector = subSectorMatch[1].trim();
            }
            const ratingMatch = content.match(/\|\s*\*\*Rating\*\*\s*\|\s*([^|]+)\s*\|/i);
            if (ratingMatch && ratingMatch[1]) {
              rating = ratingMatch[1].trim();
            }
          } catch (e) {
            console.error(`Error reading card for ${ticker}:`, e);
          }
        } else {
          // Custom defaults for known tickers without cards to enrich the graph
          if (ticker === 'SpaceX' || ticker === 'SPCX') {
            sector = 'Aerospace';
            subSector = 'Space Exploration';
            rating = 'Buy';
          } else if (ticker === 'ADBE') {
            sector = 'Technology';
            subSector = 'Creative Software';
            rating = 'Market Perform';
          } else if (ticker === 'TSLA') {
            sector = 'Consumer Discretionary';
            subSector = 'Automotive & Clean Energy';
            rating = 'Neutral';
          } else if (ticker === 'TYL') {
            sector = 'Technology';
            subSector = 'Government Software';
            rating = 'Buy';
          }
        }
        
        companies.push({
          ticker,
          name,
          sector,
          subSector,
          rating,
          hasCard: existsSync(cardPath),
          hasLog: existsSync(join(fullPath, 'Thesis_Log.md'))
        });
      }
    }

    companies.sort((a, b) => a.ticker.localeCompare(b.ticker));

    return NextResponse.json({ companies });
  } catch (error: any) {
    console.error("Error listing companies:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
