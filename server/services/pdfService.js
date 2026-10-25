import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfModule = require('pdf-parse');

/**
 * Extracts plain text content and metadata from a PDF file buffer.
 * Supports both modern pdf-parse class interface and legacy function interface.
 * @param {Buffer} buffer - Raw file buffer of the uploaded PDF
 * @returns {Promise<{ text: string, numPages: number, info: object, isReadable: boolean }>}
 */
export async function extractTextFromPdf(buffer) {
  try {
    // 1. Check if class interface (pdf-parse v2+)
    if (pdfModule.PDFParse && typeof pdfModule.PDFParse === 'function') {
      const parser = new pdfModule.PDFParse({ data: buffer });
      try {
        await parser.load();
        const textResult = await parser.getText();
        let extractedText = '';
        if (typeof textResult === 'string') {
          extractedText = textResult;
        } else if (textResult && typeof textResult.text === 'string') {
          extractedText = textResult.text;
        } else if (textResult && Array.isArray(textResult.pages)) {
          extractedText = textResult.pages.map((p) => p.text || '').join('\n');
        }

        const trimmed = (extractedText || '').trim();
        const numPages = textResult?.total || textResult?.pages?.length || 1;
        let info = {};
        try {
          info = (await parser.getInfo()) || {};
        } catch {
          // ignore info error
        }

        return {
          text: trimmed,
          numPages,
          info,
          isReadable: trimmed.length > 20,
        };
      } finally {
        try {
          if (typeof parser.destroy === 'function') {
            await parser.destroy();
          }
        } catch {
          // ignore destroy error
        }
      }
    }

    // 2. Legacy function interface
    if (typeof pdfModule === 'function') {
      const data = await pdfModule(buffer);
      const trimmed = (data.text || '').trim();
      return {
        text: trimmed,
        numPages: data.numpages || 1,
        info: data.info || {},
        isReadable: trimmed.length > 20,
      };
    }

    return {
      text: '',
      numPages: 0,
      info: {},
      isReadable: false,
      error: 'Unrecognized PDF parser interface',
    };
  } catch (error) {
    console.error('PDF parsing error:', error.message);
    return {
      text: '',
      numPages: 0,
      info: {},
      isReadable: false,
      error: error.message,
    };
  }
}
