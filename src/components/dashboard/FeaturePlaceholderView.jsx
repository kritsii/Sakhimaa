import React from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Compass, 
  Code2, 
  CheckCircle2, 
  HeartPulse,
  FileText,
  Pill,
  CalendarHeart,
  BookOpen,
  Activity,
  Heart,
  Baby
} from 'lucide-react';

const ICONS = {
  HeartPulse,
  FileText,
  Pill,
  CalendarHeart,
  BookOpen,
  Activity,
  Heart,
  Baby,
};

export default function FeaturePlaceholderView({
  feature,
  onBackToDashboard,
}) {
  if (!feature) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
        <p className="text-[#705B51]">No feature selected.</p>
        <button
          onClick={onBackToDashboard}
          className="px-6 py-2 rounded-full bg-[#559C91] text-white font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const IconComponent = ICONS[feature.iconName] || Sparkles;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Header / Breadcrumbs */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EADFCF]">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-[#45362F] bg-white border border-[#EADFCF] hover:border-[#559C91] hover:text-[#559C91] shadow-xs cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EEF4EC] text-[#559C91] border border-[#559C91]/30">
          Module Connected
        </span>
      </div>

      {/* Feature Showcase Card */}
      <div className="rounded-3xl bg-[#FFF9F1] border border-[#EADFCF] p-8 sm:p-12 shadow-sm space-y-6 text-center sm:text-left">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-16 h-16 rounded-3xl bg-[#EEF4EC] border border-[#559C91]/30 flex items-center justify-center text-[#559C91] shrink-0 shadow-xs">
            <IconComponent className="w-8 h-8 stroke-[1.8]" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#F2E8DC] text-[#705B51]">
                {feature.category || 'Healthcare Module'}
              </span>
              <span className="text-xs font-semibold text-[#559C91] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Configured & Route-Ready</span>
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#45362F]">
              {feature.title}
            </h1>

            <p className="text-base text-[#705B51] leading-relaxed max-w-2xl">
              {feature.description}
            </p>
          </div>
        </div>

        {/* Integration Details for Teammates */}
        <div className="rounded-2xl bg-white border border-[#EADFCF] p-6 space-y-4 text-left">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#45362F]">
            <Code2 className="w-4 h-4 text-[#559C91]" />
            <span>Developer & Teammate Integration Specs</span>
          </div>

          <p className="text-xs sm:text-sm text-[#705B51] leading-relaxed">
            This module has been configured with centralized routing in <code className="bg-[#F2E8DC] px-1.5 py-0.5 rounded text-[#45362F] font-mono text-xs">src/constants/routes.js</code>. Teammates developing this specific page can directly wire their component to the configured destination path.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-[#FFF9F1] border border-[#EADFCF]/70">
              <span className="text-[#705B51] block text-[11px]">Route Constant Identifier</span>
              <code className="text-[#45362F] font-bold text-xs">{feature.routeConstant}</code>
            </div>

            <div className="p-3 rounded-xl bg-[#FFF9F1] border border-[#EADFCF]/70">
              <span className="text-[#705B51] block text-[11px]">Target Destination Path</span>
              <code className="text-[#559C91] font-bold text-xs">{feature.path}</code>
            </div>
          </div>
        </div>

        {/* Return Button */}
        <div className="pt-4 flex justify-center sm:justify-start">
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-[#559C91] hover:bg-[#437F76] shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Return to Dashboard Overview</span>
          </button>
        </div>

      </div>

    </div>
  );
}
