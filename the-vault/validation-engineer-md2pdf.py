"""
Markdown-to-PDF conversion script.

Skill reference: pdf (reportlab — SimpleDocTemplate / Platypus approach)
Dependencies:    pip install reportlab markdown
"""

import re
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem


def markdown_to_pdf(markdown_text: str, output_path: str) -> None:
    """
    Convert a markdown string to a PDF file using reportlab.

    Supports:
    - # Heading 1
    - ## Heading 2
    - ### Heading 3
    - Paragraph text
    - - Unordered list items
    - 1. Ordered list items

    Args:
        markdown_text: Raw markdown string.
        output_path:   Destination PDF file path.
    """
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )

    styles = getSampleStyleSheet()
    story: list = []

    # Split input into lines and group consecutive non-blank lines into blocks
    lines = markdown_text.splitlines()
    list_items: list[str] = []

    def flush_list() -> None:
        """Append any accumulated list items to the story."""
        if list_items:
            items = [ListItem(Paragraph(item, styles["Normal"])) for item in list_items]
            story.append(ListFlowable(items, bulletType="bullet"))
            story.append(Spacer(1, 4 * mm))
            list_items.clear()

    for line in lines:
        stripped = line.strip()

        # Blank line — flush pending list, add vertical space
        if not stripped:
            flush_list()
            story.append(Spacer(1, 4 * mm))
            continue

        # Headings
        heading_match = re.match(r"^(#{1,3})\s+(.*)", stripped)
        if heading_match:
            flush_list()
            level = len(heading_match.group(1))
            text = heading_match.group(2)
            style_name = {1: "Heading1", 2: "Heading2", 3: "Heading3"}[level]
            story.append(Paragraph(text, styles[style_name]))
            story.append(Spacer(1, 2 * mm))
            continue

        # Unordered list item
        if re.match(r"^[-*+]\s+", stripped):
            list_items.append(stripped[2:].strip())
            continue

        # Ordered list item
        ordered_match = re.match(r"^\d+\.\s+(.*)", stripped)
        if ordered_match:
            list_items.append(ordered_match.group(1))
            continue

        # Plain paragraph
        flush_list()
        story.append(Paragraph(stripped, styles["Normal"]))
        story.append(Spacer(1, 2 * mm))

    # Flush any remaining list items at end of input
    flush_list()

    doc.build(story)
    print(f"PDF written to: {output_path}")


# ---------------------------------------------------------------------------
# Example usage
# ---------------------------------------------------------------------------

SAMPLE_MARKDOWN = """
# FourPointZero — Q1 Recruitment Report

## Executive Summary

FourPointZero placed 12 candidates across creative technology and AI roles
during Q1 2026, achieving a fill rate above the industry directional average
for specialist creative-tech recruitment.

## Key Highlights

- Virtual production placements up on the prior quarter
- Three AI-specialist roles closed within 14 days of brief
- Expanded coverage into spatial computing and immersive design

## Methodology

### Candidate Sourcing

Candidates were sourced via the FourPointZero proprietary network built over
six years of specialist creative-tech recruitment activity.

### Validation

1. Portfolio review by a senior creative technologist
2. Structured competency interview
3. Client culture alignment assessment
"""

if __name__ == "__main__":
    output = Path(__file__).parent / "validation-engineer-output.pdf"
    markdown_to_pdf(SAMPLE_MARKDOWN, str(output))
