import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Flower2,
  HeartPulse,
  Info,
  Leaf,
  ShieldAlert,
} from 'lucide-react';

const practices = {
  pregnant: [
    {
      name: 'Supported Easy Pose',
      sanskrit: 'Sukhasana',
      description: 'A comfortable seated position for a few calm breaths.',
      steps: [
        'Sit on a folded blanket or firm cushion, with your back supported if helpful.',
        'Let your legs rest comfortably; change position if your hips or knees feel strained.',
        'Breathe naturally and keep your shoulders soft. Do not hold your breath.',
      ],
      modification: 'Use a chair if sitting on the floor is uncomfortable.',
    },
    {
      name: 'Seated Side Stretch',
      sanskrit: 'Parsva Sukhasana',
      description: 'A small, supported side bend while seated.',
      steps: [
        'Sit comfortably with both sitting bones supported.',
        'Rest one hand beside you and lift the other arm only as far as feels easy.',
        'Lean gently to the side without twisting or compressing your abdomen, then switch sides.',
      ],
      modification: 'Keep the lifted hand on your hip instead of reaching overhead.',
    },
    {
      name: 'Gentle Cat-Cow',
      sanskrit: 'Marjaryasana-Bitilasana',
      description: 'A slow movement between two comfortable shapes on hands and knees.',
      steps: [
        'Come onto hands and knees with a stable, comfortable base.',
        'As you breathe in, let your chest open slightly; as you breathe out, gently round your back.',
        'Move slowly through a small range and return to a neutral back.',
      ],
      modification: 'Place padding under your knees or skip this pose if getting down or kneeling is uncomfortable.',
    },
    {
      name: 'Supported Butterfly',
      sanskrit: 'Baddha Konasana',
      description: 'A seated hip-opening position with no forcing or bouncing.',
      steps: [
        'Sit on a cushion and bring the soles of your feet together, leaving space between your feet and body.',
        'Support your thighs with cushions if they feel pulled or unsupported.',
        'Sit upright and breathe comfortably; do not press your knees toward the floor.',
      ],
      modification: 'Separate your feet further or choose a chair if this creates pressure or discomfort.',
    },
    {
      name: 'Wall-Supported Mountain',
      sanskrit: 'Tadasana',
      description: 'A steady standing pause with a wall or chair close by for support.',
      steps: [
        'Stand near a wall or sturdy chair, feet comfortably apart.',
        'Keep your knees soft and shoulders relaxed; use the support for balance.',
        'Take a few easy breaths, then sit down if you feel tired or unsteady.',
      ],
      modification: 'Stay seated if standing balance feels different or uncertain.',
    },
  ],
  postnatal: [
    {
      name: 'Supported Resting Position',
      sanskrit: 'Savasana variation',
      description: 'A comfortable pause to rest your body without stretching.',
      steps: [
        'Lie on your side with pillows supporting your head, arms, and knees, or choose a comfortable reclined chair.',
        'Let your body settle and breathe normally without trying to control the breath.',
        'Take your time changing position; ask for help if you need it.',
      ],
      modification: 'Use whichever resting position your care team has recommended.',
    },
    {
      name: 'Wrist and Ankle Circles',
      sanskrit: 'Gentle joint mobility',
      description: 'Small, comfortable circles that can be done while seated or resting.',
      steps: [
        'Find a supported seated or lying position.',
        'Make a few small circles with your wrists, then your ankles, staying within a comfortable range.',
        'Pause between movements and stop if anything feels uncomfortable.',
      ],
      modification: 'Move just one joint at a time or leave out any movement that does not feel right.',
    },
    {
      name: 'Seated Neck Release',
      sanskrit: 'Gentle neck mobility',
      description: 'A small range-of-motion practice for moments spent sitting or feeding.',
      steps: [
        'Sit with your back and arms supported, keeping your shoulders relaxed.',
        'Turn your head slightly to one side, return to centre, and repeat on the other side.',
        'Keep the movement small and easy; do not pull on your head or force a stretch.',
      ],
      modification: 'Skip the movement and simply rest your head in a comfortable neutral position.',
    },
    {
      name: 'Supported Chest Opener',
      sanskrit: 'Seated shoulder opening',
      description: 'A gentle change of posture to counter a rounded sitting position.',
      steps: [
        'Sit with your back supported and feet resting comfortably.',
        'Let your shoulders ease back a little, keeping your arms relaxed and your ribs soft.',
        'Release after a breath or two; avoid arching your back or holding the position.',
      ],
      modification: 'Keep your shoulders neutral and focus on sitting comfortably if opening your chest feels strained.',
    },
    {
      name: 'Seated Shoulder Shrugs',
      sanskrit: 'Gentle shoulder release',
      description: 'A small shoulder movement that can be done with your arms supported.',
      steps: [
        'Sit comfortably with your arms resting on cushions or armrests.',
        'Gently lift your shoulders a little, then let them soften down.',
        'Repeat only a few times, breathing normally and keeping the movement easy.',
      ],
      modification: 'Skip the lift and let your shoulders rest if you feel tension or discomfort.',
    },
  ],
};

const journeyContent = {
  pregnant: {
    eyebrow: 'Gentle movement for pregnancy',
    title: 'Prenatal yoga & asanas',
    intro: 'Explore supported, low-intensity poses and move only in ways that feel comfortable for your body today.',
    note: 'Pregnancy changes balance and comfort. Ask your maternity care team whether yoga is suitable for you, especially if you have pregnancy complications or are new to exercise.',
    safety: [
      'Avoid hot yoga, breath-holding, deep twists, and poses that compress your abdomen.',
      'Use a wall, chair, or cushions for support; avoid positions where a fall is possible.',
      'After the first trimester, avoid staying flat on your back. Change position if you feel unwell.',
    ],
  },
  postnatal: {
    eyebrow: 'Rest and gentle mobility after birth',
    title: 'Postnatal yoga & gentle asanas',
    intro: 'A recovery-focused collection of supported rest and small, seated movements. These are intentionally different from the prenatal poses and are not a return-to-exercise routine.',
    note: 'Recovery is individual. Check with your care team before starting or restarting movement, particularly after a C-section, significant tearing, or complications. Follow any limits they have given you.',
    safety: [
      'Prioritize supported rest; these movements are optional and should not feel like a workout.',
      'Avoid abdominal effort, straining, and any position that causes pain, pressure, or pulling.',
      'Stop and contact your care team if movement increases bleeding or causes concerning symptoms.',
    ],
  },
};

export default function YogaGuide({ journey, onBackToDashboard }) {
  const selectedJourney = journey === 'postnatal' ? 'postnatal' : 'pregnant';
  const content = journeyContent[selectedJourney];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3 border-b border-[#EADFCF] pb-3">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 rounded-full border border-[#EADFCF] bg-white px-4 py-2 text-sm font-semibold text-[#45362F] shadow-xs transition-colors hover:border-[#559C91] hover:text-[#559C91] focus:outline-none focus:ring-2 focus:ring-[#559C91] cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Dashboard</span>
        </button>
        <span className="rounded-full border border-[#8667A0]/30 bg-[#F4EFF8] px-3 py-1 text-xs font-semibold text-[#75578E]">
          {selectedJourney === 'pregnant' ? 'Pregnancy care' : 'Postnatal care'}
        </span>
      </div>

      <section className="overflow-hidden rounded-3xl border border-[#EADFCF] bg-gradient-to-br from-[#FFF9F1] via-[#FFFBF6] to-[#F4EFF8] p-6 shadow-xs sm:p-9">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#8667A0]/20 bg-white/80 text-[#8667A0]">
            <Flower2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8667A0]">
              {content.eyebrow}
            </p>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#45362F] sm:text-4xl">
              {content.title}
            </h1>
            <p className="mt-3 max-w-3xl leading-relaxed text-[#705B51]">
              {content.intro}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#8667A0]/20 bg-white/75 p-4 text-sm leading-relaxed text-[#705B51]">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#8667A0]" aria-hidden="true" />
          <p>{content.note}</p>
        </div>
      </section>

      <section aria-labelledby="yoga-safety-title" className="rounded-3xl border border-[#EADFCF] bg-[#FFF9F1] p-5 sm:p-7">
        <div className="mb-4 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-[#D98F96]" aria-hidden="true" />
          <h2 id="yoga-safety-title" className="font-serif text-xl font-bold text-[#45362F]">
            Keep your practice gentle
          </h2>
        </div>
        <ul className="grid gap-3 sm:grid-cols-3">
          {content.safety.map((item) => (
            <li key={item} className="flex items-start gap-2.5 rounded-2xl bg-white p-4 text-sm leading-relaxed text-[#705B51]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#5F7C58]" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="yoga-poses-title" className="space-y-4">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-[#5F7C58]" aria-hidden="true" />
          <h2 id="yoga-poses-title" className="font-serif text-2xl font-bold text-[#45362F]">
            {selectedJourney === 'pregnant' ? 'Supported poses to explore' : 'Gentle movements to explore'}
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-[#705B51]">
          There is no need to complete every pose. Choose a comfortable option, use support, and stop whenever you need to.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {practices[selectedJourney].map((practice, index) => (
            <article key={practice.name} className="rounded-3xl border border-[#EADFCF] bg-[#FFFDF9] p-5 shadow-xs sm:p-6">
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4EFF8] text-sm font-bold text-[#75578E]">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#45362F]">{practice.name}</h3>
                  <p className="text-xs font-medium text-[#8667A0]">{practice.sanskrit}</p>
                </div>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-[#705B51]">{practice.description}</p>
              <ol className="space-y-2 text-sm leading-relaxed text-[#705B51]">
                {practice.steps.map((step, stepIndex) => (
                  <li key={step} className="flex gap-2">
                    <span className="font-semibold text-[#5F7C58]">{stepIndex + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-4 rounded-xl bg-[#EEF4EC] px-3.5 py-3 text-xs leading-relaxed text-[#4D6947]">
                <strong>Make it easier:</strong> {practice.modification}
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-2xl border border-[#EADFCF] bg-[#F7F1E8] p-4 text-xs leading-relaxed text-[#705B51]">
        <HeartPulse className="mt-0.5 h-4 w-4 shrink-0 text-[#D98F96]" aria-hidden="true" />
        <p>
          This guide is for general wellbeing and is not medical advice or an individualized exercise plan. Stop if you feel unwell, dizzy, short of breath, or in pain, and contact your care team with concerns.
        </p>
      </div>
    </div>
  );
}
