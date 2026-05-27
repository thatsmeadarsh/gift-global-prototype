import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const md = readFileSync(join(root, 'CLIENT_PREWORK.md'), 'utf8')

// Simple markdown → HTML renderer (covers the patterns in this doc)
function mdToHtml(text) {
  return text
    // Headings
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr>')
    // Blockquote-style bold lines (used for Format / Priority labels)
    .replace(/^(\*\*(?:Format|Priority|Options|What we need|Why we need it|Questions to answer|Example|Important notes):?\*\*)/gm, '<p class="label">$1</p>')
    // Tables
    .replace(/(\|.+\|\n)(\|[-| :]+\|\n)((\|.+\|\n)*)/g, (_, header, sep, body) => {
      const headerCells = header.trim().split('|').filter(Boolean).map(c => `<th>${c.trim()}</th>`).join('')
      const bodyRows = body.trim().split('\n').filter(Boolean).map(row => {
        const cells = row.trim().split('|').filter(Boolean).map(c => `<td>${c.trim()}</td>`).join('')
        return `<tr>${cells}</tr>`
      }).join('')
      return `<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`
    })
    // Unordered lists
    .replace(/(^- .+$\n?)+/gm, match => {
      const items = match.trim().split('\n').map(l => `<li>${l.replace(/^- /, '')}</li>`).join('')
      return `<ul>${items}</ul>`
    })
    // Ordered lists
    .replace(/(^\d+\. .+$\n?)+/gm, match => {
      const items = match.trim().split('\n').map(l => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('')
      return `<ol>${items}</ol>`
    })
    // Inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Paragraphs (lines with content not already wrapped)
    .replace(/^(?!<[a-z]|$)(.+)$/gm, '<p>$1</p>')
    // Collapse blank lines
    .replace(/\n{3,}/g, '\n\n')
}

const body = mdToHtml(md)

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 10.5pt;
    color: #1a1a1a;
    line-height: 1.65;
    padding: 0;
    background: white;
  }

  /* Cover page */
  .cover {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 72px;
    background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
    color: white;
    page-break-after: always;
  }
  .cover-tag {
    font-size: 9pt;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #93c5fd;
    margin-bottom: 28px;
  }
  .cover h1 {
    font-size: 32pt;
    font-weight: 800;
    line-height: 1.15;
    color: white;
    margin-bottom: 20px;
    border: none;
    padding: 0;
    background: none;
  }
  .cover-sub {
    font-size: 13pt;
    color: #cbd5e1;
    max-width: 480px;
    line-height: 1.6;
    margin-bottom: 48px;
  }
  .cover-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 32px;
    max-width: 420px;
  }
  .cover-meta-item { }
  .cover-meta-label {
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #64748b;
    margin-bottom: 3px;
  }
  .cover-meta-value {
    font-size: 10pt;
    color: #e2e8f0;
    font-weight: 500;
  }
  .cover-footer {
    margin-top: auto;
    font-size: 8.5pt;
    color: #475569;
    border-top: 1px solid #1e3a5f;
    padding-top: 20px;
  }

  /* Content area */
  .content {
    padding: 52px 72px;
    max-width: 100%;
  }

  h1 {
    font-size: 22pt;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 8px;
    margin-top: 40px;
    padding-bottom: 10px;
    border-bottom: 3px solid #2563eb;
  }
  h1:first-child { margin-top: 0; }

  h2 {
    font-size: 14pt;
    font-weight: 700;
    color: #1e40af;
    margin-top: 36px;
    margin-bottom: 10px;
    page-break-after: avoid;
    border-left: 4px solid #2563eb;
    padding-left: 12px;
  }

  h3 {
    font-size: 11pt;
    font-weight: 600;
    color: #374151;
    margin-top: 20px;
    margin-bottom: 6px;
  }

  p {
    margin-bottom: 10px;
    color: #374151;
  }

  p.label {
    margin-top: 14px;
    margin-bottom: 4px;
    color: #1e40af;
  }

  ul, ol {
    margin: 8px 0 12px 22px;
    color: #374151;
  }

  li {
    margin-bottom: 4px;
  }

  strong { color: #111827; }
  em { color: #4b5563; }
  code {
    background: #f1f5f9;
    padding: 1px 5px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 9.5pt;
    color: #be185d;
  }

  hr {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 28px 0;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0 18px 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }
  thead {
    background: #1e40af;
    color: white;
  }
  thead th {
    padding: 8px 10px;
    text-align: left;
    font-weight: 600;
    font-size: 9pt;
  }
  tbody tr:nth-child(even) { background: #f8fafc; }
  tbody tr:nth-child(odd)  { background: white; }
  tbody td {
    padding: 7px 10px;
    border-bottom: 1px solid #e2e8f0;
    color: #374151;
    vertical-align: top;
  }

  /* Summary checklist special table — highlight priority column */
  tbody td:nth-child(3) {
    font-size: 9pt;
    font-weight: 600;
  }

  /* Priority badges inline */
  p, li, td {
    /* emoji colours render naturally */
  }

  /* Page numbers via CSS */
  @page {
    size: A4;
    margin: 0;
  }

  @media print {
    .cover { page-break-after: always; }
    h2 { page-break-after: avoid; }
    table { page-break-inside: avoid; }
  }
</style>
</head>
<body>

<!-- Cover page -->
<div class="cover">
  <div class="cover-tag">🎁 GiftGlobal Platform</div>
  <h1>Pre-Implementation<br>Requirements</h1>
  <div class="cover-sub">
    A complete list of information and decisions needed from the client before development begins — written for non-technical readers.
  </div>
  <div class="cover-meta">
    <div class="cover-meta-item">
      <div class="cover-meta-label">Prepared for</div>
      <div class="cover-meta-value">Client</div>
    </div>
    <div class="cover-meta-item">
      <div class="cover-meta-label">Prepared by</div>
      <div class="cover-meta-value">Development Team</div>
    </div>
    <div class="cover-meta-item">
      <div class="cover-meta-label">Date</div>
      <div class="cover-meta-value">May 2026</div>
    </div>
    <div class="cover-meta-item">
      <div class="cover-meta-label">Version</div>
      <div class="cover-meta-value">1.1</div>
    </div>
    <div class="cover-meta-item">
      <div class="cover-meta-label">Total Items</div>
      <div class="cover-meta-value">15 Action Items</div>
    </div>
    <div class="cover-meta-item">
      <div class="cover-meta-label">Status</div>
      <div class="cover-meta-value">Awaiting Client Input</div>
    </div>
  </div>
  <div class="cover-footer">
    🔴 6 items must be resolved before development starts &nbsp;·&nbsp; 🟡 9 items needed before launch
  </div>
</div>

<!-- Main content -->
<div class="content">
${body}
</div>

</body>
</html>`

writeFileSync(join(root, 'scripts', 'prework.html'), html)
console.log('HTML generated')

// Generate PDF with Playwright
const browser = await chromium.launch()
const page = await browser.newPage()
await page.setContent(html, { waitUntil: 'networkidle' })

const pdf = await page.pdf({
  format: 'A4',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
})

await browser.close()

const outPath = join(root, 'CLIENT_PREWORK.pdf')
writeFileSync(outPath, pdf)
console.log(`PDF saved to: ${outPath}`)
