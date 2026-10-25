import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Flower2,
  HeartPulse,
  Leaf,
  ShieldAlert,
} from 'lucide-react';
import FeatureTip from './FeatureTip';

const practices = {
  pregnant: [
    {
      name: 'Supported Easy Pose',
      sanskrit: 'Sukhasana',
      description: 'A comfortable seated position for a few calm breaths.',
      image: '/images/yoga/supported-easy-pose.png',
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
      description: 'A gentle side bend to improve flexibility and relieve tension.',
      image: '/images/yoga/seated-side-stretch.png',
      steps: [
        'Sit comfortably with both sitting bones supported.',
        'Rest one hand beside you and lift the other arm only as far as feels easy.',
        'Lean gently to the side without twisting or compressing your abdomen, then switch sides.',
      ],
      modification: 'Keep the lifted hand on your hip instead of reaching overhead.',
    },
    {
      name: 'Gentle Cat-Cow',
      sanskrit: 'Marjaryasana–Bitilasana',
      description: 'A slow movement between two comfortable shapes on hands and knees.',
      image: '/images/yoga/gentle-cat-cow.png',
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
      image: '/images/yoga/supported-butterfly.png',
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
      image: '/images/yoga/wall-supported-mountain.png',
      steps: [
        'Stand near a wall or sturdy chair, feet comfortably apart.',
        'Keep your knees soft and shoulders relaxed; use the support for balance.',
        'Take a few easy breaths, then sit down if you feel tired or unsteady.',
      ],
      modification: 'Stay seated if standing balance feels different or uncertain.',
    },
    {
      name: 'Supported Bridge',
      sanskrit: 'Setu Bandha Sarvangasana',
      description: 'A gentle backbend to strengthen your back and open your chest.',
      image: '/images/yoga/supported-bridge.png',
      steps: [
        'Lie comfortably on your back with knees bent and feet flat on the floor, hip-width apart.',
        'Place a yoga bolster or firm cushion under your hips and lower back for support.',
        'Rest your arms alongside your body with palms up, breathing gently and effortlessly.',
        'To release, gently press through your feet, slide the support out, and roll to your side.',
      ],
      modification: 'Keep the bolster low. If you feel any dizziness or discomfort lying down, immediately roll to your left side.',
    },
  ],
  postnatal: [
    {
      name: 'Supported Resting Position',
      sanskrit: 'Savasana variation',
      description: 'Lie comfortably with a cushion under the knees.',
      image: '/images/yoga/supported-resting-position.png',
      steps: [
        'Lie comfortably on your back with a supportive cushion or bolster under your knees.',
        'Rest your head on a low pillow, keeping your neck and spine in neutral alignment.',
        'Place your arms softly by your sides with palms facing up, breathing smoothly and naturally.',
        'Take your time changing positions and ask for assistance whenever you need it.',
      ],
      modification: 'Use whichever resting position your healthcare team has recommended. If lying flat feels uncomfortable, elevate your head and chest or roll gently to your side.',
    },
    {
      name: 'Wrist and Ankle Circles',
      sanskrit: 'Gentle joint mobility',
      description: 'Make small, comfortable circles with the wrists and ankles.',
      image: '/images/yoga/wrist-and-ankle-circles.png',
      steps: [
        'Sit comfortably in a sturdy chair with your back supported and feet flat.',
        'Extend your forearms forward and slowly rotate your wrists clockwise, then counter-clockwise.',
        'Lift one foot slightly and make gentle ankle circles, then switch to the other side.',
        'Pause between movements and stay within an easy, comfortable range.',
      ],
      modification: 'Move just one joint at a time while resting your forearms on your lap or chair armrests.',
    },
    {
      name: 'Seated Neck Release',
      sanskrit: 'Gentle neck mobility',
      description: 'Tilt the head gently to each side without forcing the stretch.',
      image: '/images/yoga/seated-neck-release.png',
      steps: [
        'Sit upright with relaxed shoulders and your hands resting gently on your thighs.',
        'Lower your right ear toward your right shoulder without pulling with your hand.',
        'Hold for 3 to 5 soft, rhythmic breaths, return to center, and repeat on the left side.',
        'Keep the movement small and easy; never force the stretch.',
      ],
      modification: 'Skip the movement and simply rest your head in a comfortable neutral position if any tightness arises.',
    },
    {
      name: 'Supported Chest Opener',
      sanskrit: 'Seated chest opening',
      description: 'Open the chest gently while keeping the shoulders relaxed.',
      image: '/images/yoga/supported-chest-opener.png',
      steps: [
        'Sit comfortably in a chair with both feet grounded and your back tall.',
        'Bring your hands behind your head or neck with elbows gently open.',
        'Let your chest expand naturally without arching your lower back or straining.',
        'Release after two or three calm breaths, keeping your shoulders loose.',
      ],
      modification: 'Keep your hands resting on your collarbones or upper thighs if lifting your arms creates tension.',
    },
    {
      name: 'Seated Shoulder Shrugs',
      sanskrit: 'Gentle shoulder release',
      description: 'Raise the shoulders gently, then lower and relax them.',
      image: '/images/yoga/seated-shoulder-shrugs.png',
      steps: [
        'Sit in a comfortable upright position with your arms resting on cushions or armrests.',
        'Inhale gently as you lift both shoulders up toward your ears.',
        'Exhale smoothly and let your shoulders soften down, melting away tension.',
        'Repeat only 3 to 5 times, breathing normally throughout.',
      ],
      modification: 'Perform small, backward shoulder rolls instead of vertical shrugs if that feels more natural.',
    },
    {
      name: 'Seated Deep Breathing',
      sanskrit: 'Mindful breathing',
      badge: 'Recommended addition',
      description: 'Sit comfortably, place one hand on the chest and one on the abdomen, and breathe naturally without straining.',
      image: '/images/yoga/seated-deep-breathing.png',
      steps: [
        'Sit comfortably in a supportive chair with feet flat and shoulders relaxed.',
        'Place one hand on your chest and the other gently on your abdomen.',
        'Inhale slowly and quietly through your nose, feeling the gentle rise under your hands.',
        'Exhale smoothly and completely through your mouth or nose, letting your body soften.',
        'Continue for 1 to 2 minutes at an unhurried, comfortable pace.',
      ],
      modification: 'Rest both hands on your lap if holding one hand on your chest creates arm or neck fatigue.',
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
  const [selectedPoseModal, setSelectedPoseModal] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedPoseModal) {
        setSelectedPoseModal(null);
      }
    };
    if (selectedPoseModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPoseModal]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      <section className="relative rounded-3xl border border-[#EADFCF] bg-gradient-to-br from-[#FFF9F1] via-[#FFFBF6] to-[#F4EFF8] p-6 shadow-xs sm:p-9">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#8667A0]/20 bg-white/80 text-[#8667A0]">
            <Flower2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="flex-1 pr-14 sm:pr-20">
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

        <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7">
          <FeatureTip tip={content.note} />
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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {practices[selectedJourney].map((practice, index) => (
            <article
              key={practice.name}
              className="flex flex-col justify-between rounded-3xl border border-[#EADFCF] bg-[#FFFDF9] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div>
                {/* Visual Image Header */}
                {practice.image ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#F4EFF8] mb-4 border border-[#EADFCF]/50 shadow-2xs">
                    <img
                      src={practice.image}
                      alt={`${practice.name} (${practice.sanskrit}) - Prenatal yoga pose`}
                      className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#F4EFF8] to-[#FFF9F1] mb-4 border border-[#EADFCF]/50 flex items-center justify-center text-[#8667A0]">
                    <Flower2 className="w-8 h-8 opacity-60" />
                  </div>
                )}

                {/* Card Title & Info */}
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F4EFF8] text-xs font-bold text-[#75578E] shadow-2xs">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif text-lg font-bold text-[#45362F] leading-snug">
                        {practice.name}
                      </h3>
                      {practice.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF5EF] text-[#42867B] border border-[#559C91]/30">
                          {practice.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-[#8667A0]">
                      {practice.sanskrit}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#705B51] leading-relaxed mb-4">
                  {practice.description}
                </p>
              </div>

              {/* View Steps Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPoseModal(practice)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#559C91] bg-[#EEF5F1] hover:bg-[#559C91] hover:text-white transition-all duration-200 cursor-pointer shadow-2xs group"
                >
                  <span>View Steps</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </button>
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

      {/* Yoga Pose Details Modal (pops up just like GetStartedModal) */}
      {selectedPoseModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#45362F]/45 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pose-modal-title"
          onClick={() => setSelectedPoseModal(null)}
        >
          <div
            className="relative w-full max-w-lg sm:max-w-xl bg-[#FFF9F1] rounded-3xl border-2 border-[#EADFCF] shadow-2xl p-6 sm:p-8 overflow-hidden text-[#45362F] transition-all max-h-[90vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative background gradient blobs */}
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#F4B49B]/25 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-[#A8BCA1]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Pose Image */}
            {selectedPoseModal.image ? (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#F4EFF8] mb-5 border border-[#EADFCF] shadow-sm">
                <img
                  src={selectedPoseModal.image}
                  alt={`${selectedPoseModal.name} (${selectedPoseModal.sanskrit})`}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            ) : (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#F4EFF8] to-[#FFF9F1] mb-5 border border-[#EADFCF] flex items-center justify-center text-[#8667A0]">
                <Flower2 className="w-12 h-12 opacity-60" />
              </div>
            )}

            {/* Pose Title & Info */}
            <div className="mb-4">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EFF8] text-[#75578E] text-xs font-semibold">
                  <Flower2 className="w-3.5 h-3.5" />
                  <span>{selectedPoseModal.sanskrit}</span>
                </div>
                {selectedPoseModal.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF5EF] text-[#42867B] border border-[#559C91]/30">
                    {selectedPoseModal.badge}
                  </span>
                )}
              </div>
              <h3 id="pose-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-[#45362F]">
                {selectedPoseModal.name}
              </h3>
              <p className="text-sm text-[#705B51] mt-1 leading-relaxed">
                {selectedPoseModal.description}
              </p>
            </div>

            {/* Steps Guidance */}
            <div className="space-y-4 pt-3 border-t border-[#EADFCF]/70">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#45362F]">
                Step-by-step guidance
              </h4>
              <ol className="space-y-3 text-sm leading-relaxed text-[#705B51]">
                {selectedPoseModal.steps.map((step, idx) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF4EC] text-xs font-bold text-[#559C91]">
                      {idx + 1}
                    </span>
                    <span className="flex-1 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>

              {/* Modification / Comfort tip */}
              {selectedPoseModal.modification && (
                <div className="rounded-2xl bg-[#EEF4EC] border border-[#559C91]/30 p-4 text-xs sm:text-sm leading-relaxed text-[#4D6947] flex items-start gap-2.5 mt-3">
                  <CheckCircle2 className="w-4 h-4 text-[#559C91] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#3A5634]">Make it easier: </strong>
                    <span>{selectedPoseModal.modification}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Done Button */}
            <div className="mt-6 pt-4 border-t border-[#EADFCF]/70 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPoseModal(null)}
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#559C91] hover:bg-[#437F76] transition-all cursor-pointer shadow-xs"
              >
                Close Guidance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
