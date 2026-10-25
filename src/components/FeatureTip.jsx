import React, { useState, useRef, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';

export default function FeatureTip({
  tip,
  title = 'Helpful Care Tip',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!tip) return null;

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Hide helpful care tip' : 'Reveal helpful care tip'}
        title={isOpen ? 'Hide tip' : 'Click to view helpful care tip'}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs ${
          isOpen
            ? 'bg-[#45362F] text-white border border-[#45362F] shadow-sm scale-105'
            : 'bg-white/95 hover:bg-white text-[#5C4A42] hover:text-[#45362F] border border-[#EADFCF] hover:border-[#559C91] hover:shadow-sm'
        }`}
      >
        <Lightbulb
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen
              ? 'text-amber-300 fill-amber-300 scale-110'
              : 'text-amber-500 fill-amber-400/50'
          }`}
        />
        <span>Tip</span>
      </button>

      {/* Revealed Tip Popover Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={title}
          className="absolute right-0 bottom-full mb-3 w-80 sm:w-96 max-w-[calc(100vw-2.5rem)] rounded-2xl bg-[#FFFDF9] border border-[#EADFCF] p-4 sm:p-5 shadow-xl shadow-[#45362F]/15 z-50 animate-fadeIn text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#EADFCF]/70">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#FCECE5] flex items-center justify-center text-[#D98F96]">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-400/60" />
              </div>
              <span className="text-xs font-bold text-[#45362F] uppercase tracking-wider">
                {title}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-[#705B51] hover:text-[#45362F] hover:bg-[#F2E8DC] transition-colors cursor-pointer"
              aria-label="Close care tip"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <p className="text-xs sm:text-sm text-[#614D43] leading-relaxed">
            {tip}
          </p>

          {/* Pointer Arrow */}
          <div
            className="absolute -bottom-2 right-4 w-3.5 h-3.5 bg-[#FFFDF9] border-r border-b border-[#EADFCF] rotate-45"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
