import fs from 'fs';
import path from 'path';

const outDir = path.resolve('test-fixtures');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Generate an invalid file (.txt)
fs.writeFileSync(
  path.join(outDir, 'invalid_document.txt'),
  'This is a plain text file, not a medical PDF or image report.'
);

// 2. Generate an oversized file (> 10 MB)
const oversizedBuffer = Buffer.alloc(11 * 1024 * 1024, 0);
fs.writeFileSync(path.join(outDir, 'oversized_report.pdf'), oversizedBuffer);

// 3. Generate a minimal valid PDF with realistic de-identified CBC medical report text
function createSimplePdf(textContent) {
  const contentStream = `BT /F1 11 Tf 50 720 Td (${textContent.replace(/[\n\r]+/g, ') Tj T* (').replace(/[()]/g, '')}) Tj ET`;
  const streamLength = Buffer.byteLength(contentStream);

  const pdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length ${streamLength} >>
stream
${contentStream}
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000300 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
385
%%EOF`;
  return Buffer.from(pdf);
}

const cbcText = `CITY DIAGNOSTICS & MATERNAL CARE LAB
Patient: DE-IDENTIFIED (Female, 28 Yrs)
Date: 2026-10-15
Test Name: COMPLETE BLOOD COUNT (CBC) - ANTENATAL PROFILE
Parameter: Haemoglobin | Reported: 10.8 g/dL | Reference: 11.5 - 15.0 g/dL | Flag: L
Parameter: White Blood Cells (WBC) | Reported: 9.4 10^3/uL | Reference: 4.5 - 11.0 10^3/uL | Flag: Normal
Parameter: Platelets | Reported: 210 10^3/uL | Reference: 150 - 450 10^3/uL | Flag: Normal
Parameter: Packed Cell Volume (PCV) | Reported: 33.2 % | Reference: 36.0 - 46.0 % | Flag: L
Parameter: Red Blood Cell Count | Reported: 3.9 10^6/uL | Reference: 3.8 - 5.2 10^6/uL | Flag: Normal
Notes: Mild physiological normocytic normochromic anemia. Advised iron study and dietary review with obstetrician.`;

fs.writeFileSync(path.join(outDir, 'sample_cbc_report.pdf'), createSimplePdf(cbcText));

// 4. Generate a valid 1x1 or small PNG image
// Minimal 1x1 PNG buffer
const minimalPng = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
  0x0d, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x60, 0x60, 0x60, 0x60,
  0x00, 0x00, 0x00, 0x05, 0x00, 0x01, 0xa7, 0x35, 0x17, 0xf6, 0x00, 0x00,
  0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
]);
fs.writeFileSync(path.join(outDir, 'sample_report_image.png'), minimalPng);

console.log('Test fixtures created in test-fixtures/');
