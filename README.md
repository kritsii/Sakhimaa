# SakhiMaa — Maternal & Newborn Healthcare Companion

SakhiMaa is a maternal and newborn healthcare companion designed for pregnant and postnatal women, offering wellness tracking, medication schedules, appointment planning, and clinical report insights.

---

## Medical Report Analysis Feature

The **Medical Report Analysis** feature allows an expectant mother or new parent to upload a medical laboratory report (as a PDF or image) and receive a calm, plain-language explanation of medical terminology, measured values, reference ranges, and practical questions to discuss with their doctor.

### Key Capabilities
- **Multi-format Support**: Accepts PDF (`.pdf`), JPEG (`.jpeg`, `.jpg`), and PNG (`.png`) up to 10 MB.
- **Client & Server-side Validation**: Validates file MIME types, file extensions, and file sizes before processing.
- **In-Memory Privacy Architecture**: Documents are processed strictly in ephemeral memory buffers and are never stored permanently on disk or written to `localStorage`.
- **Intelligent Text Extraction**:
  - Direct PDF text and metadata extraction via `pdf-parse`.
  - Tesseract OCR for scanned documents and image files.
  - Multimodal input to Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`).
- **Clinical Schema & Safety Validation**:
  - Enforces strict factual adherence: missing reference ranges are never invented.
  - Distinguishes laboratory-printed flags from educational commentary.
  - Prioritizes maternal red-flag safety guidance when critical parameters or symptoms are reported.
  - Generates actionable, practical questions for healthcare consultations.
  - Displays a medical safety disclaimer on all summaries.

---

## Quick Setup & Running Locally

### 1. Configure the AI API Key

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Add your Google Gemini API key (recommended) or OpenAI key:

```env
# Google Gemini API (Get a free key at https://aistudio.google.com/)
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Max Upload Size in MB
MAX_FILE_SIZE_MB=10
```

> **Note:** If no API key is provided, the application will display a setup guidance view rather than faking medical results.

### 2. Run the Development Server

The API middleware is embedded directly into the Vite development server:

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

- Click on **Dashboard** in the top navigation.
- Click the **Pregnancy Health Report Analysis** card (or switch to the Postnatal journey for the Postnatal card).
- Upload a test document (`sample_cbc_report.pdf` located in `test-fixtures/`).

### 3. Optional: Run Standalone Backend

If you wish to run the Node/Express server separately:

```bash
npm run server
```

The standalone API will listen on `http://localhost:5001`.

---

## API Endpoints

### `POST /api/reports/analyze`
Accepts `multipart/form-data`:
- `file`: PDF or image file (max 10 MB)
- `reportType`: Optional report category
- `journeyType`: `'pregnant'` or `'postnatal'`
- `userNote`: Optional question or symptom note

Returns structured JSON:
```json
{
  "success": true,
  "reportType": "Complete Blood Count (CBC)",
  "reportDate": "2026-10-15",
  "summary": "This report contains results from a routine complete blood count...",
  "isReadSuccessfully": true,
  "findings": [
    {
      "testName": "Haemoglobin",
      "value": "10.8",
      "unit": "g/dL",
      "referenceRange": "11.5 - 15.0",
      "status": "low",
      "laboratoryFlag": "L",
      "explanation": "Haemoglobin is an oxygen-carrying protein..."
    }
  ],
  "whatResultsMean": [...],
  "questionsForDoctor": [...],
  "safetyGuidance": {
    "level": "advisory",
    "message": "...",
    "reasons": [...]
  },
  "limitations": [...],
  "disclaimer": "SakhiMaa helps explain medical information in simple language..."
}
```

### `GET /api/reports/config`
Returns current server AI configuration status and file upload limits.

---

## Medical Disclaimer

SakhiMaa provides supportive educational explanations to empower mothers during healthcare visits. It does not provide medical diagnoses, treatment changes, or replace consultation with a qualified doctor, obstetrician, or emergency care provider.
