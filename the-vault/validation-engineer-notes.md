# Validation: Markdown-to-PDF Script Planning Notes

**Task:** FOU-75 — Create a simple markdown-to-PDF conversion script
**Skill referenced:** `pdf` (reportlab approach)

## Approach

Following the implementation workflow from HEARTBEAT.md:

### 1. Assess
Convert a markdown string to a PDF file. The pdf skill identifies **reportlab** as the correct library for creating PDFs programmatically in Python.

### 2. Plan

**Selected approach:** `markdown` + `reportlab`

- Use the `markdown` library to parse the markdown string
- Map markdown elements (headings, paragraphs, lists) to reportlab `Platypus` story elements
- Use `SimpleDocTemplate` and `Paragraph` with `getSampleStyleSheet` — the pattern the pdf skill demonstrates for multi-section documents

**Why reportlab over alternatives:**
- `pypdf` is for reading/manipulating existing PDFs, not creating from text
- `reportlab` is the pdf skill's recommended library for PDF creation
- No external binary dependencies (vs `wkhtmltopdf`, `weasyprint`)

**Dependencies:**
```
pip install reportlab markdown
```

### 3. Output
Script saved to: `the-vault/validation-engineer-md2pdf.py`
