import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileCheck,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  X,
  Sparkles,
  Stethoscope,
  Info,
  Clock,
  Printer,
  RotateCcw,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  HeartPulse,
  Baby,
  ChevronRight,
} from 'lucide-react';
import FeatureTip from './FeatureTip';

const MAX_FILE_SIZE_MB = 10;
const MAX_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_EXTENSIONS = ['.pdf', '.jpeg', '.jpg', '.png'];
const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

const REPORT_TYPE_OPTIONS = [
  'Unknown',
  'Complete Blood Count (CBC)',
  'Thyroid Profile (TSH / T3 / T4)',
  'Urine Routine & Microscopy',
  'Blood Glucose / HbA1c',
  'Ultrasound / Sonography',
  'Liver Function Test (LFT)',
  'Kidney Function Test (KFT / RFT)',
  'Iron / Ferritin Study',
  'Double / Triple / Quadruple Marker',
  'Other',
];

export default function MedicalReportAnalysis({
  currentUser,
  journey = 'pregnant',
  onBackToDashboard,
}) {
  // File state
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Context form state
  const [reportType, setReportType] = useState('Unknown');
  const [journeyType, setJourneyType] = useState(
    currentUser?.journey || journey || 'pregnant'
  );
  const [userNote, setUserNote] = useState('');
  const [showContextOptions, setShowContextOptions] = useState(false);

  // Analysis state: 'idle' | 'analyzing' | 'results' | 'error' | 'unconfigured'
  const [analysisState, setAnalysisState] = useState('idle');
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Server config status
  const [serverConfig, setServerConfig] = useState(null);

  const fileInputRef = useRef(null);

  // Check backend service configuration on mount
  useEffect(() => {
    fetch('/api/reports/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setServerConfig(data);
        }
      })
      .catch((err) => {
        console.warn('Could not reach report analysis config endpoint:', err);
      });
  }, []);

  // Clean up object URL when file changes
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  // Stepped loading messages during analysis
  useEffect(() => {
    let timer1, timer2, timer3;
    if (analysisState === 'analyzing') {
      setAnalysisStep(1); // "Reading your report…"
      timer1 = setTimeout(() => {
        setAnalysisStep(2); // "Identifying important values…"
      }, 2200);
      timer2 = setTimeout(() => {
        setAnalysisStep(3); // "Preparing your easy-to-understand summary…"
      }, 4800);
      timer3 = setTimeout(() => {
        setAnalysisStep(4); // "Finalizing clinical educational insights…"
      }, 8000);
    } else {
      setAnalysisStep(0);
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [analysisState]);

  // File validation helper
  const validateFile = (file) => {
    setFileError(null);

    if (!file) {
      return false;
    }

    // 1. File size check
    if (file.size > MAX_BYTES) {
      setFileError(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`
      );
      return false;
    }

    // 2. File type check (extension and MIME)
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    const mime = (file.type || '').toLowerCase();

    const isValidExt = ACCEPTED_EXTENSIONS.includes(ext);
    const isValidMime = ACCEPTED_MIME_TYPES.includes(mime) || mime === '';

    if (!isValidExt || !isValidMime) {
      setFileError(
        `Unsupported file type (${ext || file.type || 'unknown'}). Please upload a PDF, JPEG, JPG, or PNG document.`
      );
      return false;
    }

    return true;
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }

    if (!validateFile(file)) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setFileError(null);

    // Create thumbnail preview if image
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileError(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit file for analysis
  const handleAnalyzeReport = async () => {
    if (!selectedFile) {
      setFileError('Please select a report file to analyse.');
      return;
    }

    setAnalysisState('analyzing');
    setApiError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('reportType', reportType);
    formData.append('journeyType', journeyType);
    if (userNote.trim()) {
      formData.append('userNote', userNote.trim());
    }

    try {
      const response = await fetch('/api/reports/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 503 || data.setupRequired) {
          setAnalysisState('unconfigured');
          setApiError(
            data.error ||
              'The report analysis AI service is not configured yet. Please configure the GEMINI_API_KEY.'
          );
          return;
        }
        throw new Error(
          data.error || `Server responded with status ${response.status}`
        );
      }

      if (data && data.success) {
        setAnalysisResult(data);
        setAnalysisState('results');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(data.error || 'Failed to analyze report.');
      }
    } catch (err) {
      console.error('Report analysis error:', err);
      setApiError(
        err.message ||
          'Unable to complete report analysis. Please check your connection and try again.'
      );
      setAnalysisState('error');
    }
  };

  const handleReset = () => {
    handleRemoveFile();
    setAnalysisState('idle');
    setAnalysisResult(null);
    setApiError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  // Restrained, professional status badge styling helper
  const getStatusBadge = (status, labFlag) => {
    if (labFlag) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#FFF2EE] text-[#C85D4E] border border-[#F4C5BE]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C85D4E]"></span>
          <span>Lab Flag: {labFlag}</span>
        </span>
      );
    }
    switch (status) {
      case 'within_range':
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#EEF5F1] text-[#3D776E] border border-[#C5DDD7]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#468A80]"></span>
            <span>Within standard range</span>
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#F6F3FA] text-[#6E5587] border border-[#DCD3E8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7D6299]"></span>
            <span>Reported lower</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#FFF6EE] text-[#B85E38] border border-[#F2D3BE]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C96C42]"></span>
            <span>Reported higher</span>
          </span>
        );
      case 'abnormal':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#FFF2EE] text-[#C85D4E] border border-[#F4C5BE]">
            <AlertCircle className="w-3 h-3 text-[#C85D4E]" />
            <span>Noted by lab</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#F4EDE2] text-[#68574F]">
            <span>Value noted</span>
          </span>
        );
    }
  };

  // Safety indicator styling helper
  const getSafetyLevelBanner = (safety) => {
    if (!safety) return null;
    if (safety.level === 'urgent') {
      return (
        <div className="rounded-2xl bg-[#FFF5F4] border border-[#F0A8A0] p-5 sm:p-6 shadow-xs space-y-3 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFE4E1] flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-[#C93B2B]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C93B2B] bg-[#FFE4E1] px-2 py-0.5 rounded">
                  Clinical Priority
                </span>
                <span className="text-xs text-[#705B51]">Prompt medical evaluation recommended</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#45362F]">
                When to Seek Medical Attention Promptly
              </h3>
            </div>
          </div>

          <p className="text-sm text-[#45362F] leading-relaxed font-medium pl-0 sm:pl-12">
            {safety.message}
          </p>

          {safety.reasons && safety.reasons.length > 0 && (
            <div className="pl-0 sm:pl-12">
              <ul className="text-xs text-[#45362F] list-disc list-inside space-y-1 bg-white/80 p-3.5 rounded-xl border border-[#F0A8A0]/50">
                {safety.reasons.map((reason, idx) => (
                  <li key={idx} className="font-medium">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-[#705B51] italic pl-0 sm:pl-12">
            If you are experiencing severe headache, vision changes, sudden swelling, severe abdominal pain, vaginal bleeding, or reduced fetal movement, do not wait—please visit your nearest maternity hospital or emergency care right away.
          </p>
        </div>
      );
    }

    if (safety.level === 'advisory') {
      return (
        <div className="rounded-2xl bg-[#FFF9F3] border border-[#EBD2B8] p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FDF0E3] flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-5 h-5 text-[#C06A3B]" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C06A3B] bg-[#FDF0E3] px-2 py-0.5 rounded">
                  Healthcare Advisory
                </span>
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#45362F]">
                Recommended Consultation Follow-Up
              </h3>
            </div>
          </div>

          <p className="text-sm text-[#614D43] leading-relaxed pl-0 sm:pl-12">
            {safety.message}
          </p>

          {safety.reasons && safety.reasons.length > 0 && (
            <div className="pl-0 sm:pl-12">
              <ul className="text-xs text-[#614D43] list-disc list-inside space-y-1 bg-white/70 p-3 rounded-xl border border-[#EADFCF]">
                {safety.reasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="rounded-2xl bg-[#F6FAF7] border border-[#CDE3DC] p-5 shadow-xs space-y-2">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-[#B8DCD3] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#468A80]" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-serif text-base font-bold text-[#45362F]">
              Routine Care & Next Appointment
            </h3>
            <p className="text-xs sm:text-sm text-[#5C4A42] leading-relaxed">
              {safety.message ||
                'These findings can be reviewed with your doctor at your next scheduled antenatal or postnatal consultation.'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Print summary action in results mode */}
      {analysisState === 'results' && (
        <div className="flex justify-end pb-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#45362F] bg-white border border-[#E0D3C5] hover:border-[#559C91] hover:text-[#559C91] shadow-2xs cursor-pointer transition-colors"
            title="Print or save summary for your appointment"
          >
            <Printer className="w-3.5 h-3.5 text-[#559C91]" />
            <span>Print Summary</span>
          </button>
        </div>
      )}

      {/* 2. Page Introduction */}
      <div className="space-y-3 text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#559C91]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Compassionate Health Guidance</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#45362F] tracking-tight">
          Understand Your Health Reports
        </h1>
        <p className="text-sm sm:text-base text-[#614D43] leading-relaxed max-w-3xl">
          Medical reports can feel confusing. Upload your report, and SakhiMaa
          will help explain the medical terms and results in simple language, so
          you can have a more informed conversation with your healthcare
          professional.
        </p>

        {/* Compact Privacy & Service Note */}
        <div className="rounded-xl bg-white border border-[#E8DCCF] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#705B51] shadow-2xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#559C91] shrink-0" />
            <span>
              <strong className="text-[#45362F]">Privacy Notice:</strong> Your report contains personal health information. Upload only reports you are comfortable sharing. Documents are processed temporarily in memory.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {serverConfig && (
              <div>
                {serverConfig.isConfigured ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF5F1] text-[#3D776E] font-medium text-[11px] border border-[#C5DDD7]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#468A80]"></span>
                    <span>AI Engine Ready</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF6EE] text-[#B85E38] font-medium text-[11px] border border-[#F2D3BE]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C96C42]"></span>
                    <span>API Key Setup Needed</span>
                  </span>
                )}
              </div>
            )}
            <FeatureTip tip="This AI explanation is an educational reference to prepare you for clinical conversations. It is not a clinical diagnosis or treatment prescription. Always review results with your doctor." />
          </div>
        </div>
      </div>

      {/* VIEW: Unconfigured AI Service Banner */}
      {analysisState === 'unconfigured' && (
        <div className="rounded-2xl bg-white border border-[#EBD2B8] p-6 space-y-4 shadow-sm animate-fadeIn text-left">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF0E3] text-[#C06A3B] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <h2 className="font-serif text-lg font-bold text-[#45362F]">
                AI Analysis Setup Required
              </h2>
              <p className="text-xs sm:text-sm text-[#705B51] leading-relaxed">
                {apiError ||
                  'The AI analysis service is not yet configured with an API key.'}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[#FBF7F0] border border-[#E8DCCF] p-4 space-y-2 text-xs text-[#45362F]">
            <p className="font-bold text-[#45362F]">Setup Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-[#614D43] leading-relaxed">
              <li>Open the <code className="bg-white px-1.5 py-0.5 rounded text-[#45362F] font-mono border border-[#E0D3C5]">.env</code> file in your project directory.</li>
              <li>
                Add your Gemini API key:
                <pre className="mt-1 bg-[#3A2E28] text-[#F7F1E8] p-2.5 rounded-lg overflow-x-auto font-mono text-xs">
                  GEMINI_API_KEY=your_gemini_api_key_here
                </pre>
              </li>
              <li>
                Get a free API key at{' '}
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#559C91] underline font-semibold inline-flex items-center gap-1"
                >
                  Google AI Studio <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ol>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleAnalyzeReport}
              className="px-5 py-2 rounded-lg bg-[#559C91] text-white font-medium text-xs hover:bg-[#468A80] transition-colors cursor-pointer shadow-2xs"
            >
              Retry Analysis
            </button>
            <button
              onClick={() => setAnalysisState('idle')}
              className="px-4 py-2 rounded-lg bg-white border border-[#E0D3C5] text-[#5C4A42] hover:text-[#45362F] font-medium text-xs transition-colors cursor-pointer"
            >
              Change Selected File
            </button>
          </div>
        </div>
      )}

      {/* VIEW: General Error Banner */}
      {analysisState === 'error' && (
        <div className="rounded-2xl bg-[#FFF5F4] border border-[#F0A8A0] p-5 space-y-3 shadow-xs animate-fadeIn text-left">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FFE4E1] text-[#C93B2B] flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 flex-1">
              <h2 className="font-serif text-base font-bold text-[#45362F]">
                Unable to Complete Report Analysis
              </h2>
              <p className="text-xs sm:text-sm text-[#705B51] leading-relaxed">
                {apiError}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 pl-11">
            <button
              onClick={handleAnalyzeReport}
              className="px-4 py-1.5 rounded-lg bg-[#559C91] text-white font-medium text-xs hover:bg-[#468A80] transition-colors cursor-pointer shadow-2xs"
            >
              Try Again
            </button>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-[#E0D3C5] text-[#5C4A42] font-medium text-xs hover:text-[#45362F] transition-colors cursor-pointer"
            >
              Upload a Different Document
            </button>
          </div>
        </div>
      )}

      {/* VIEW: Loading / Analyzing Animation */}
      {analysisState === 'analyzing' && (
        <div className="rounded-2xl bg-white border border-[#E8DCCF] p-8 sm:p-12 shadow-sm text-center space-y-7 animate-fadeIn">
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#559C91]/15 animate-ping" />
            <div className="absolute inset-1 rounded-full bg-[#559C91]/20 animate-pulse" />
            <div className="relative w-14 h-14 rounded-2xl bg-[#EEF5F1] border border-[#C5DDD7] flex items-center justify-center text-[#559C91] shadow-xs">
              <FileSpreadsheet className="w-7 h-7 animate-bounce" />
            </div>
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="font-serif text-2xl font-bold text-[#45362F]">
              Reviewing Your Report
            </h2>
            <p className="text-xs sm:text-sm text-[#705B51] leading-relaxed">
              SakhiMaa is carefully reading the lab values and preparing an
              empathetic, simple explanation for you.
            </p>
          </div>

          {/* Stepped progress indicators */}
          <div className="max-w-md mx-auto space-y-2.5 text-left">
            <div
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                analysisStep >= 1
                  ? 'bg-[#FAF7F2] border-[#C5DDD7] shadow-2xs'
                  : 'bg-white border-[#E8DCCF]/50 opacity-40'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  analysisStep > 1
                    ? 'bg-[#559C91] text-white'
                    : analysisStep === 1
                    ? 'bg-[#EEF5F1] text-[#559C91] animate-spin'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {analysisStep > 1 ? '✓' : '1'}
              </div>
              <span className="text-xs font-semibold text-[#45362F]">
                Reading your report…
              </span>
            </div>

            <div
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                analysisStep >= 2
                  ? 'bg-[#FAF7F2] border-[#C5DDD7] shadow-2xs'
                  : 'bg-white border-[#E8DCCF]/50 opacity-40'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  analysisStep > 2
                    ? 'bg-[#559C91] text-white'
                    : analysisStep === 2
                    ? 'bg-[#EEF5F1] text-[#559C91] animate-spin'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {analysisStep > 2 ? '✓' : '2'}
              </div>
              <span className="text-xs font-semibold text-[#45362F]">
                Identifying important values & lab ranges…
              </span>
            </div>

            <div
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                analysisStep >= 3
                  ? 'bg-[#FAF7F2] border-[#C5DDD7] shadow-2xs'
                  : 'bg-white border-[#E8DCCF]/50 opacity-40'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  analysisStep > 3
                    ? 'bg-[#559C91] text-white'
                    : analysisStep === 3
                    ? 'bg-[#EEF5F1] text-[#559C91] animate-spin'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {analysisStep > 3 ? '✓' : '3'}
              </div>
              <span className="text-xs font-semibold text-[#45362F]">
                Preparing your easy-to-understand summary…
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#A8988D] max-w-sm mx-auto">
            This typically takes 5–15 seconds depending on document length and scan quality.
          </p>
        </div>
      )}

      {/* VIEW: Upload Form (when idle, error, or unconfigured) */}
      {analysisState !== 'analyzing' && analysisState !== 'results' && (
        <div className="space-y-6">
          {/* Uploader Card */}
          <div className="rounded-2xl bg-white border border-[#E8DCCF] p-5 sm:p-7 shadow-xs space-y-6">
            <div className="space-y-1">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#45362F]">
                Upload Your Medical Report
              </h2>
              <p className="text-xs sm:text-sm text-[#705B51]">
                Drag and drop your report here, or browse files from your device.
              </p>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-9 text-center transition-all duration-200 cursor-pointer ${
                isDragging
                  ? 'border-[#559C91] bg-[#EEF5F1]/50 scale-[1.005]'
                  : selectedFile
                  ? 'border-[#559C91]/60 bg-[#FAF7F2]'
                  : 'border-[#DECFC1] bg-[#FAF7F2]/60 hover:border-[#559C91]/60 hover:bg-[#EEF5F1]/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpeg,.jpg,.png,application/pdf,image/jpeg,image/png"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="medical-report-file-input"
              />

              {!selectedFile ? (
                <div className="space-y-3.5">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EEF5F1] border border-[#C5DDD7] flex items-center justify-center text-[#559C91] shadow-2xs">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#45362F]">
                      <span className="text-[#559C91] underline decoration-dotted underline-offset-4">
                        Choose a file
                      </span>{' '}
                      or drag & drop here
                    </p>
                    <p className="text-xs text-[#705B51]">
                      Supported formats: PDF, JPEG, JPG, PNG (Max {MAX_FILE_SIZE_MB} MB)
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E0D3C5] text-[11px] font-medium text-[#705B51]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#559C91]" />
                    <span>Processed securely in-memory</span>
                  </div>
                </div>
              ) : (
                /* Selected File Preview */
                <div
                  className="space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-3.5 rounded-xl bg-white border border-[#E0D3C5] shadow-2xs max-w-md mx-auto">
                    {filePreviewUrl ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#E0D3C5] shrink-0 bg-[#FAF7F2]">
                        <img
                          src={filePreviewUrl}
                          alt="Report Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-[#EEF5F1] text-[#559C91] border border-[#C5DDD7] flex items-center justify-center shrink-0">
                        <FileCheck className="w-7 h-7" />
                      </div>
                    )}

                    <div className="text-left flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-[#45362F] truncate">
                          {selectedFile.name}
                        </p>
                        <button
                          onClick={handleRemoveFile}
                          className="p-1 rounded-lg hover:bg-[#FCECE5] text-[#705B51] hover:text-[#D98F96] transition-colors cursor-pointer"
                          title="Remove this file"
                          aria-label="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-[#705B51]">
                        <span className="uppercase font-mono font-medium px-1.5 py-0.5 rounded bg-[#F4EDE2] text-[#45362F] text-[11px]">
                          {selectedFile.name.split('.').pop()}
                        </span>
                        <span>
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                        <span className="text-[#3D776E] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#705B51]">
                    Click{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#559C91] underline font-semibold cursor-pointer"
                    >
                      here
                    </button>{' '}
                    to pick a different file
                  </p>
                </div>
              )}
            </div>

            {/* File Error Message */}
            {fileError && (
              <div className="p-3 rounded-xl bg-[#FFF5F4] border border-[#F0A8A0] flex items-center gap-2.5 text-xs font-semibold text-[#C93B2B] animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Optional Report Context Section */}
            <div className="border-t border-[#E8DCCF] pt-4 space-y-3">
              <button
                type="button"
                onClick={() => setShowContextOptions(!showContextOptions)}
                className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-[#45362F] hover:text-[#559C91] transition-colors cursor-pointer"
                aria-expanded={showContextOptions}
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#559C91]" />
                  <span>Help Us Understand Your Report (Optional)</span>
                </div>
                <div className="text-xs text-[#705B51] flex items-center gap-1 font-normal">
                  <span>{showContextOptions ? 'Hide options' : 'Add context'}</span>
                  {showContextOptions ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {showContextOptions && (
                <div className="space-y-4 pt-1 animate-fadeIn text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Report Type */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="report-type-select"
                        className="block text-xs font-semibold text-[#45362F]"
                      >
                        Report Type (optional)
                      </label>
                      <select
                        id="report-type-select"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="w-full rounded-xl bg-[#FAF7F2] border border-[#E0D3C5] px-3.5 py-2 text-xs sm:text-sm text-[#45362F] focus:outline-none focus:ring-1 focus:ring-[#559C91] focus:border-[#559C91]"
                      >
                        {REPORT_TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-[#705B51]">
                        Leave as &quot;Unknown&quot; if you are unsure; SakhiMaa will identify it automatically.
                      </p>
                    </div>

                    {/* Journey Context */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="journey-context-select"
                        className="block text-xs font-semibold text-[#45362F]"
                      >
                        Maternal Journey Context
                      </label>
                      <select
                        id="journey-context-select"
                        value={journeyType}
                        onChange={(e) => setJourneyType(e.target.value)}
                        className="w-full rounded-xl bg-[#FAF7F2] border border-[#E0D3C5] px-3.5 py-2 text-xs sm:text-sm text-[#45362F] focus:outline-none focus:ring-1 focus:ring-[#559C91] focus:border-[#559C91]"
                      >
                        <option value="pregnant">Pregnancy Journey</option>
                        <option value="postnatal">Postnatal Recovery</option>
                      </select>
                      <p className="text-[11px] text-[#705B51]">
                        Helps provide stage-relevant explanations.
                      </p>
                    </div>
                  </div>

                  {/* Optional user note */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="user-note-input"
                      className="block text-xs font-semibold text-[#45362F]"
                    >
                      Is there anything specific you would like explained? (optional)
                    </label>
                    <textarea
                      id="user-note-input"
                      rows={2}
                      value={userNote}
                      onChange={(e) => setUserNote(e.target.value)}
                      placeholder="e.g. My doctor mentioned checking my iron levels, or I noticed a value with a star next to it."
                      className="w-full rounded-xl bg-[#FAF7F2] border border-[#E0D3C5] p-3 text-xs sm:text-sm text-[#45362F] focus:outline-none focus:ring-1 focus:ring-[#559C91] focus:border-[#559C91] placeholder:text-[#A8988D] resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#705B51]">
                {!selectedFile ? (
                  <span>Select a document above to begin analysis.</span>
                ) : (
                  <span className="text-[#3D776E] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Document ready to be analyzed
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleAnalyzeReport}
                disabled={!selectedFile}
                className={`w-full sm:w-auto px-7 py-3 rounded-xl font-serif font-bold text-sm tracking-wide shadow-xs transition-all duration-200 flex items-center justify-center gap-2 ${
                  selectedFile
                    ? 'bg-[#559C91] text-white hover:bg-[#468A80] hover:shadow-md cursor-pointer'
                    : 'bg-[#E5D7C9] text-[#9A8B80] cursor-not-allowed opacity-80 shadow-none'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyse My Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Structured Results View */}
      {analysisState === 'results' && analysisResult && (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn text-left">

          {/* D. Report Overview ("Your Report at a Glance") */}
          <div className="rounded-2xl bg-white border border-[#E8DCCF] p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#E8DCCF] pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#559C91]">
                  Executive Summary
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#45362F]">
                  Your Report at a Glance
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EEF5F1] text-[#3D776E] border border-[#C5DDD7]">
                  {analysisResult.reportType || 'Medical Report'}
                </span>
                {analysisResult.reportDate && (
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E0D3C5] text-[#5C4A42] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#559C91]" />
                    <span>Dated: {analysisResult.reportDate}</span>
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm sm:text-base text-[#5C4A42] leading-relaxed max-w-4xl">
              {analysisResult.summary}
            </p>

            {analysisResult.isReadSuccessfully === false && (
              <div className="p-3.5 rounded-xl bg-[#FFF5F4] border border-[#F0A8A0] text-xs text-[#C93B2B] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Some parts of this document appeared faint, low-resolution, or partially blurred. Extracted details should be confirmed against your original lab sheet with your physician.
                </span>
              </div>
            )}
          </div>

          {/* E. Important Findings Table & Responsive Cards */}
          <div className="rounded-2xl bg-white border border-[#E8DCCF] p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E8DCCF] pb-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#559C91]">
                  Extracted Measurements
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#45362F]">
                  Important Findings
                </h2>
                <p className="text-xs text-[#705B51]">
                  Verified test measurements extracted directly from your report. Reference ranges represent those specified on this laboratory sheet.
                </p>
              </div>

              <span className="text-xs font-medium text-[#705B51] shrink-0">
                {analysisResult.findings?.length || 0} measurements identified
              </span>
            </div>

            {analysisResult.findings && analysisResult.findings.length > 0 ? (
              <>
                {/* Desktop / Tablet Table View */}
                <div className="hidden md:block overflow-x-auto rounded-xl border border-[#E8DCCF]">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8DCCF] text-[#45362F] font-serif font-bold text-xs">
                      <tr>
                        <th className="py-3 px-4 w-[24%]">Test / Parameter</th>
                        <th className="py-3 px-4 w-[18%]">Reported Value</th>
                        <th className="py-3 px-4 w-[18%]">Lab Reference Range</th>
                        <th className="py-3 px-4 w-[18%]">Status / Indicator</th>
                        <th className="py-3 px-4 w-[22%]">Simple Explanation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DCCF]/70 text-[#45362F]">
                      {analysisResult.findings.map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-[#FCFAF7] transition-colors"
                        >
                          {/* Test Name */}
                          <td className="py-3.5 px-4 font-semibold text-[#3D2F28] align-top">
                            {item.testName}
                          </td>

                          {/* Value and Unit */}
                          <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#45362F] align-top whitespace-nowrap">
                            {item.value !== null ? item.value : '—'}{' '}
                            {item.unit && (
                              <span className="font-sans font-normal text-xs text-[#705B51]">
                                {item.unit}
                              </span>
                            )}
                          </td>

                          {/* Reference Range */}
                          <td className="py-3.5 px-4 text-xs text-[#5C4A42] align-top">
                            {item.referenceRange ? (
                              <span className="font-mono">{item.referenceRange}</span>
                            ) : (
                              <span className="italic text-[#9A8B80]">
                                Not specified on lab sheet
                              </span>
                            )}
                          </td>

                          {/* Status / Flag */}
                          <td className="py-3.5 px-4 align-top whitespace-nowrap">
                            {getStatusBadge(item.status, item.laboratoryFlag)}
                          </td>

                          {/* Simple Explanation */}
                          <td className="py-3.5 px-4 text-xs text-[#5C4A42] leading-relaxed align-top">
                            {item.explanation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Stacked Cards View (No awkward horizontal scrolling) */}
                <div className="md:hidden space-y-3">
                  {analysisResult.findings.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-xl bg-[#FAF7F2] border border-[#E8DCCF] p-4 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-sm text-[#3D2F28]">
                          {item.testName}
                        </span>
                        <div>{getStatusBadge(item.status, item.laboratoryFlag)}</div>
                      </div>

                      <div className="flex items-baseline gap-4 pt-1">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#705B51] block">
                            Reported Value
                          </span>
                          <span className="font-mono font-bold text-sm text-[#45362F]">
                            {item.value !== null ? item.value : '—'}{' '}
                            {item.unit && (
                              <span className="font-sans font-normal text-xs text-[#705B51]">
                                {item.unit}
                              </span>
                            )}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#705B51] block">
                            Reference Range
                          </span>
                          <span className="text-xs font-mono text-[#5C4A42]">
                            {item.referenceRange || 'Not specified'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E8DCCF] text-xs text-[#5C4A42] leading-relaxed">
                        {item.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-6 rounded-xl bg-[#FAF7F2] border border-[#E8DCCF] text-center text-xs text-[#705B51]">
                No tabular numerical parameters were identified in this report (for example, ultrasound narratives or imaging scan notes). Please see the summary and meaning below.
              </div>
            )}
          </div>

          {/* F. Plain-Language Insights ("What These Results Mean") */}
          {analysisResult.whatResultsMean && analysisResult.whatResultsMean.length > 0 && (
            <div className="rounded-2xl bg-white border border-[#E8DCCF] p-5 sm:p-7 shadow-xs space-y-4">
              <div className="space-y-0.5 border-b border-[#E8DCCF] pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#559C91]">
                  Educational Translation
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#45362F]">
                  What These Results Mean
                </h2>
                <p className="text-xs text-[#705B51]">
                  Translating complex clinical terms into everyday understanding for your stage of motherhood.
                </p>
              </div>

              {/* Dynamic Grid: If 1 item, display full-width; if multiple, balanced 2-column grid */}
              <div
                className={`gap-4 pt-1 ${
                  analysisResult.whatResultsMean.length === 1
                    ? 'grid grid-cols-1 max-w-3xl'
                    : 'grid grid-cols-1 md:grid-cols-2'
                }`}
              >
                {analysisResult.whatResultsMean.map((topic, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-[#FAF7F2] border border-[#E8DCCF] p-4 sm:p-5 space-y-2 hover:border-[#559C91]/40 transition-colors"
                  >
                    <h3 className="font-serif text-base font-bold text-[#45362F] flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-[#559C91] shrink-0" />
                      <span>{topic.title}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C4A42] leading-relaxed">
                      {topic.explanation}
                    </p>
                    {topic.relevance && (
                      <div className="pt-2 border-t border-[#E8DCCF] text-xs text-[#3D776E] font-medium flex items-start gap-1.5">
                        <Baby className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#559C91]" />
                        <span>{topic.relevance}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* G. Questions to Discuss with Your Doctor */}
          {analysisResult.questionsForDoctor && analysisResult.questionsForDoctor.length > 0 && (
            <div className="rounded-2xl bg-white border border-[#E8DCCF] p-5 sm:p-7 shadow-xs space-y-4">
              <div className="space-y-0.5 border-b border-[#E8DCCF] pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#559C91]">
                  Consultation Preparation
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#45362F]">
                  Questions to Discuss with Your Doctor
                </h2>
                <p className="text-xs text-[#705B51]">
                  Save or print these questions to bring to your next antenatal checkup or postnatal consultation.
                </p>
              </div>

              {/* Numbered checklist */}
              <div className="space-y-2.5 pt-1">
                {analysisResult.questionsForDoctor.map((question, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DCCF] text-xs sm:text-sm text-[#45362F] hover:border-[#559C91]/40 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#EEF5F1] text-[#3D776E] font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#C5DDD7]">
                      {index + 1}
                    </div>
                    <span className="leading-relaxed font-medium">
                      {question}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-[#FFF9F3] border border-[#EBD2B8] text-xs text-[#705B51] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#C06A3B] shrink-0" />
                <span>
                  Never start, stop, or change prescribed medicines, iron supplements, or therapies based solely on automated report explanations.
                </span>
              </div>
            </div>
          )}

          {/* H. Safety Guidance */}
          {analysisResult.safetyGuidance && (
            <div>{getSafetyLevelBanner(analysisResult.safetyGuidance)}</div>
          )}

          {/* Limitations & Quality Notes */}
          {analysisResult.limitations && analysisResult.limitations.length > 0 && (
            <div className="rounded-xl bg-white border border-[#E8DCCF] p-4 sm:p-5 space-y-1.5 text-xs text-[#705B51]">
              <p className="font-bold text-[#45362F] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#559C91]" />
                <span>Reading Notes & Limitations</span>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-[#5C4A42]">
                {analysisResult.limitations.map((lim, idx) => (
                  <li key={idx}>{lim}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Medical Disclaimer Panel */}
          <div className="rounded-xl bg-[#FAF7F2] border border-[#E8DCCF] p-4 text-center text-xs text-[#705B51] space-y-1">
            <p className="font-semibold text-[#45362F]">
              Medical Education & Safety Notice
            </p>
            <p className="max-w-2xl mx-auto leading-relaxed">
              {analysisResult.disclaimer ||
                'SakhiMaa helps explain medical information in simple language. It does not provide a diagnosis or replace advice from your healthcare professional.'}
            </p>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E8DCCF]">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#45362F] bg-white border border-[#E0D3C5] hover:border-[#559C91] hover:text-[#559C91] shadow-2xs cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Upload Another Medical Report</span>
            </button>

            <button
              onClick={onBackToDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold text-white bg-[#559C91] hover:bg-[#468A80] shadow-xs cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
