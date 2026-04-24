import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as XLSX from 'xlsx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = join(__dirname, '..', 'public', 'mock-documents');

const files = readdirSync(docsDir).filter((f) => f.toLowerCase().endsWith('.xlsx'));

for (const file of files) {
  const fullPath = join(docsDir, file);
  const buf = readFileSync(fullPath);
  const wb = XLSX.read(buf, { type: 'buffer' });
  const sheets = wb.SheetNames.map((name) => {
    const sheet = wb.Sheets[name];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', blankrows: false });
    return { name, rows };
  });
  const out = { file, sheets };
  const outPath = join(docsDir, basename(file, extname(file)) + '.sheet.json');
  writeFileSync(outPath, JSON.stringify(out));
  console.log(`  ✓ ${file} → ${basename(outPath)} (${sheets.length} sheet${sheets.length === 1 ? '' : 's'})`);
}

console.log(`Converted ${files.length} xlsx file${files.length === 1 ? '' : 's'}`);
