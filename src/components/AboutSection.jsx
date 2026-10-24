import React from 'react';
import { Heart, ShieldCheck, Sparkles, Users, Stethoscope, Award } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about-section" className="py-20 md:py-24 bg-[#FFF9F1] border-b border-[#EADFCF]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCECE5] text-[#D98F96] text-xs font-semibold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>ABOUT SAKHIMAA</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#45362F] tracking-tight">
            Created to be your gentlest confidante in motherhood.
          </h2>

          <p className="text-base sm:text-lg text-[#705B51] leading-relaxed">
            In Sanskrit and Hindi, &ldquo;Sakhi&rdquo; means a trusted lifelong companion, and &ldquo;Maa&rdquo; represents the mother. We built SakhiMaa to ensure that no mother ever feels alone, unheard, or overwhelmed by clinical uncertainty.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          <div className="p-8 rounded-3xl bg-[#F7F1E8] border border-[#EADFCF] shadow-xs space-y-4 text-left hover:border-[#D98F96] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#FCECE5] flex items-center justify-center text-[#D98F96]">
              <Heart className="w-6 h-6 fill-[#D98F96]" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#45362F]">
              Care for Her
            </h3>
            <p className="text-sm text-[#705B51] leading-relaxed">
              Maternal recovery, postpartum mental health, and antenatal comfort are never pushed to the sidelines. We place the mother&apos;s physical and emotional healing at the center.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F7F1E8] border border-[#EADFCF] shadow-xs space-y-4 text-left hover:border-[#A8BCA1] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF4EC] flex items-center justify-center text-[#5F7C58]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#45362F]">
              Care for Them
            </h3>
            <p className="text-sm text-[#705B51] leading-relaxed">
              From the first gentle flutter during pregnancy to newborn feeding intervals and diaper logs, we help parents protect and celebrate their baby&apos;s daily milestones.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F7F1E8] border border-[#EADFCF] shadow-xs space-y-4 text-left hover:border-[#C7B8DD] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#F4F0FA] flex items-center justify-center text-[#674F87]">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#45362F]">
              Evidence Over Anxiety
            </h3>
            <p className="text-sm text-[#705B51] leading-relaxed">
              We never fabricate unverified medical claims or predict unsupported outcomes. Guidance is grounded in clinical evidence and framed with reassuring empathy.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
