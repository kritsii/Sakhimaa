import { createWorker } from 'tesseract.js';

let workerPromise = null;

async function getWorker() {
  if (!workerPromise) {
    workerPromise = (async () => {
      const worker = await createWorker('eng');
      return worker;
    })();
  }
  return workerPromise;
}

/**
 * Extracts plain text from an image buffer using Tesseract OCR.
 * @param {Buffer} buffer - Raw image buffer (JPEG, PNG)
 * @returns {Promise<{ text: string, confidence: number }>}
 */
export async function extractTextFromImage(buffer) {
  try {
    const worker = await getWorker();
    const ret = await worker.recognize(buffer);
    const text = (ret.data?.text || '').trim();
    const confidence = ret.data?.confidence || 0;
    return {
      text,
      confidence,
      isReadable: text.length > 10,
    };
  } catch (error) {
    console.error('OCR recognition error:', error.message);
    return {
      text: '',
      confidence: 0,
      isReadable: false,
      error: error.message,
    };
  }
}
