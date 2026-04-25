import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import mammoth from 'mammoth';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = join(__dirname, '..', 'public', 'stack-documents');

const files = readdirSync(docsDir).filter((f) => f.toLowerCase().endsWith('.docx'));

for (const file of files) {
  const fullPath = join(docsDir, file);
  const buf = readFileSync(fullPath);
  const result = await mammoth.convertToHtml({ buffer: buf });
  const out = { file, html: result.value, messages: result.messages };
  const outPath = join(docsDir, basename(file, extname(file)) + '.html.json');
  writeFileSync(outPath, JSON.stringify(out));
  console.log(
    `  ✓ ${file} → ${basename(outPath)} (${Math.round(result.value.length / 1024)} KB)`,
  );
}

console.log(`Converted ${files.length} docx file${files.length === 1 ? '' : 's'}`);
