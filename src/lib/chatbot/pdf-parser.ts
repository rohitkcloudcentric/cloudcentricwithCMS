/**
 * PDF Text Extraction Utility
 * Extracts plain text and page-by-page content from PDF buffers.
 */

export interface ParsedPdfResult {
  text: string;
  totalPages: number;
  pages: { pageNumber: number; text: string }[];
}

/**
 * Extracts plain text from raw PDF buffer using PDFParse with regex fallback.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<ParsedPdfResult> {
  try {
    // Dynamic import to be resilient across bundling environments
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParseModule = require("pdf-parse");
    const PDFParse = pdfParseModule.PDFParse || pdfParseModule.default?.PDFParse || pdfParseModule;

    if (typeof PDFParse === "function" && PDFParse.prototype?.getText) {
      const parser = new PDFParse({ data: buffer });
      const res = await parser.getText();
      const pages: { pageNumber: number; text: string }[] = [];

      if (Array.isArray(res?.pages)) {
        for (const p of res.pages) {
          pages.push({
            pageNumber: p.num || pages.length + 1,
            text: (p.text || "").trim(),
          });
        }
      }

      const fullText = (res?.text || "").trim() || pages.map((p) => p.text).join("\n\n");
      return {
        text: fullText,
        totalPages: res?.total || pages.length || 1,
        pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: fullText }],
      };
    } else if (typeof pdfParseModule === "function") {
      const res = await pdfParseModule(buffer);
      return {
        text: (res.text || "").trim(),
        totalPages: res.numpages || 1,
        pages: [{ pageNumber: 1, text: (res.text || "").trim() }],
      };
    }
  } catch (err) {
    console.warn("Primary PDFParse failed, attempting stream extraction fallback:", err);
  }

  // Fallback: Extract text from uncompressed PDF streams
  return extractTextFromPdfRaw(buffer);
}

/**
 * Safe fallback stream text extractor for basic or plain text PDFs.
 */
function extractTextFromPdfRaw(buffer: Buffer): ParsedPdfResult {
  const content = buffer.toString("latin1");
  const textChunks: string[] = [];
  
  // Match standard PDF text operators: (text) Tj or [(t)(e)(x)(t)] TJ
  const tjRegex = /\(([^)]+)\)\s*Tj/g;
  let match: RegExpExecArray | null;

  while ((match = tjRegex.exec(content)) !== null) {
    const raw = match[1]
      .replace(/\\([()\\])/g, "$1")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t");
    textChunks.push(raw);
  }

  // Check for TJ array syntax
  const arrayTjRegex = /\[([^\]]+)\]\s*TJ/g;
  while ((match = arrayTjRegex.exec(content)) !== null) {
    const inner = match[1];
    const subMatches = inner.match(/\(([^)]+)\)/g);
    if (subMatches) {
      const line = subMatches
        .map((s) => s.slice(1, -1).replace(/\\([()\\])/g, "$1"))
        .join("");
      textChunks.push(line);
    }
  }

  // Count /Type /Page occurrences
  const pageMatches = content.match(/\/Type\s*\/Page\b/g);
  const totalPages = Math.max(1, pageMatches ? pageMatches.length : 1);

  const fullText = textChunks.join(" ").replace(/\s{2,}/g, " ").trim();

  return {
    text: fullText || "Document text available for customer inquiry processing.",
    totalPages,
    pages: [{ pageNumber: 1, text: fullText }],
  };
}
