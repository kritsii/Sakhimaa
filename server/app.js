import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { extractTextFromPdf } from './services/pdfService.js';
import { extractTextFromImage } from './services/ocrService.js';
import { analyzeReport, getAiConfigStatus } from './services/aiService.js';

// Load environment variables
dotenv.config();

const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10);
const MAX_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

// Configure Multer with memoryStorage for absolute privacy:
// Files are never written to disk, and buffers are released from memory after request ends.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_BYTES,
  },
  fileFilter: (req, file, cb) => {
    let mime = file.mimetype.toLowerCase();
    if (mime === 'image/jpg') mime = 'image/jpeg';

    const ext = (file.originalname.split('.').pop() || '').toLowerCase();
    const validExts = ['pdf', 'jpeg', 'jpg', 'png'];

    if (ALLOWED_MIME_TYPES.includes(mime) || validExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Unsupported file format: "${file.mimetype || ext}". Please upload a PDF, JPEG, JPG, or PNG document.`
        )
      );
    }
  },
});

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health and config status endpoint
  app.get('/api/reports/config', (req, res) => {
    const config = getAiConfigStatus();
    res.json({
      success: true,
      ...config,
      maxFileSizeMb: MAX_FILE_SIZE_MB,
      supportedTypes: ['.pdf', '.jpeg', '.jpg', '.png'],
    });
  });

  // Report analysis endpoint
  app.post(
    '/api/reports/analyze',
    (req, res, next) => {
      upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              error: `The uploaded file exceeds the ${MAX_FILE_SIZE_MB} MB size limit. Please choose a smaller file.`,
            });
          }
          return res.status(400).json({
            success: false,
            error: `File upload error: ${err.message}`,
          });
        } else if (err) {
          return res.status(400).json({
            success: false,
            error: err.message,
          });
        }
        next();
      });
    },
    async (req, res) => {
      try {
        const file = req.file;

        if (!file) {
          return res.status(400).json({
            success: false,
            error: 'No medical report file was provided. Please select a valid PDF or image.',
          });
        }

        // Verify AI service configuration before proceeding
        const configStatus = getAiConfigStatus();
        if (!configStatus.isConfigured) {
          return res.status(503).json({
            success: false,
            error:
              'The Medical Report Analysis AI service is not yet configured. Please set the GEMINI_API_KEY in your .env file.',
            setupRequired: true,
            provider: configStatus.provider,
          });
        }

        const reportType = req.body.reportType || 'Unknown';
        const journeyType = req.body.journeyType || 'pregnant';
        const userNote = req.body.userNote || '';

        let mimeType = file.mimetype.toLowerCase();
        if (mimeType === 'image/jpg') mimeType = 'image/jpeg';

        let extractedText = '';

        // Step 1: Text extraction
        if (mimeType === 'application/pdf') {
          const pdfResult = await extractTextFromPdf(file.buffer);
          extractedText = pdfResult.text;
        } else if (mimeType.startsWith('image/')) {
          const ocrResult = await extractTextFromImage(file.buffer);
          extractedText = ocrResult.text;
        }

        // Step 2: AI multimodal & text analysis
        const analysisResult = await analyzeReport({
          fileBuffer: file.buffer,
          mimeType,
          extractedText,
          context: {
            reportType,
            journeyType,
            userNote,
          },
        });

        // Add file metadata for display
        analysisResult.fileMeta = {
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
        };

        return res.json(analysisResult);
      } catch (err) {
        console.error('Error during report analysis:', err);
        return res.status(500).json({
          success: false,
          error:
            err.message ||
            'An unexpected error occurred while analyzing your report. Please check the document and try again.',
        });
      }
    }
  );

  return app;
}
