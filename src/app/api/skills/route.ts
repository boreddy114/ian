import { NextResponse } from 'next/server';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

export async function GET() {
  try {
    const originalPath = join(process.cwd(), 'ORGINAL');
    
    if (!existsSync(originalPath)) {
      return NextResponse.json({ skills: [] });
    }

    const items = readdirSync(originalPath);
    const skills = [];

    for (const item of items) {
      if (item.endsWith('.skill')) {
        const id = item.replace('.skill', '');
        const fullPath = join(originalPath, item);
        let name = id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        let description = 'Custom equity research analyst memo/screen template';
        
        try {
          // Extract the frontmatter from SKILL.md inside the ZIP archive using unzip
          const content = execSync(`unzip -p "${fullPath}" "*/SKILL.md"`, { encoding: 'utf8' });
          const frontmatterMatch = content.match(/^---\r?\n([\s\S]+?)\r?\n---/);
          if (frontmatterMatch && frontmatterMatch[1]) {
            const lines = frontmatterMatch[1].split('\n');
            let yamlName = '';
            let yamlDesc = '';
            let descCollect = false;
            
            for (const line of lines) {
              const nameMatch = line.match(/^name:\s*(.+)/);
              if (nameMatch) {
                yamlName = nameMatch[1].trim().replace(/^['"]|['"]$/g, '');
                descCollect = false;
                continue;
              }
              
              const descMatch = line.match(/^description:\s*(.*)/);
              if (descMatch) {
                yamlDesc = descMatch[1].trim();
                descCollect = true;
                continue;
              }
              
              if (descCollect) {
                if (line.match(/^\s+/)) {
                  yamlDesc += ' ' + line.trim();
                } else {
                  descCollect = false;
                }
              }
            }
            
            if (yamlName) {
              name = yamlName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            }
            if (yamlDesc) {
              description = yamlDesc.replace(/^['">|]+|['"]$/g, '').trim();
            }
          }
        } catch (e) {
          console.error(`Error reading skill details from zip ${item}:`, e);
        }
        
        skills.push({
          id,
          name,
          description
        });
      }
    }

    return NextResponse.json({ skills });
  } catch (error: any) {
    console.error("Error listing skills from zip archives:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
