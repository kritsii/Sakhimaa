import React from 'react';
import { 
  Heart, 
  ArrowLeft, 
  Trash2, 
  Sparkles, 
  Quote, 
  Clock, 
  Compass,
  BookmarkCheck
} from 'lucide-react';

export default function FavouritesView({
  favourites = [],
  onRemoveFavourite,
  onBackToDashboard,
}) {
  const getCategoryBadgeClass = (category = '') => {
    if (category.includes('Affirmation')) {
      return 'bg-[#EEF4EC] text-[#559C91] border-[#559C91]/30';
    }
    if (category.includes('Prayer')) {
      return 'bg-[#F2EDF8] text-[#7A628F] border-[#7A628F]/30';
    }
    return 'bg-[#FCECE5] text-[#F08070] border-[#F08070]/30';
  };

  const formatSavedDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Header / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EADFCF]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-[#45362F] bg-white border border-[#EADFCF] hover:border-[#559C91] hover:text-[#559C91] shadow-xs cursor-pointer transition-all"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#705B51]">
          <BookmarkCheck className="w-4 h-4 text-[#F08070]" />
          <span>{favourites.length} {favourites.length === 1 ? 'saved reminder' : 'saved reminders'} in your collection</span>
        </div>
      </div>

      {/* Main Title Section */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#FCECE5] border border-[#F08070]/30 flex items-center justify-center text-[#F08070] mx-auto shadow-xs">
          <Heart className="w-6 h-6 fill-[#F08070]" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#45362F]">
          My Favourite Reminders <span className="text-[#F08070]">♡</span>
        </h1>
        <p className="text-sm sm:text-base text-[#705B51] leading-relaxed">
          The positive thoughts, gentle affirmations, and prayers that brought warmth to your heart. Revisit them whenever you need a peaceful breath.
        </p>
      </div>

      {/* Favourites List or Empty State */}
      {favourites.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-[#EADFCF] bg-[#FFF9F1] p-10 sm:p-16 text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#FFF9F1] border border-[#EADFCF] flex items-center justify-center text-[#F08070] mx-auto shadow-xs">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#45362F]">
            Your sanctuary is empty for now
          </h2>
          <p className="text-sm sm:text-base text-[#705B51] max-w-md mx-auto leading-relaxed">
            Your favourite reminders will find a home here. Save a thought that speaks to your heart from the &ldquo;A Little Moment for You&rdquo; section on your dashboard.
          </p>
          <div className="pt-2">
            <button
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#559C91] hover:bg-[#437F76] shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Reminders on Dashboard</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favourites.map((item) => (
            <div
              key={item.id}
              className="relative rounded-3xl bg-[#FFF9F1] border border-[#EADFCF] p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group"
            >
              <div className="space-y-4">
                
                {/* Card Top: Category and Remove Action */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(item.category)}`}>
                    <Sparkles className="w-3 h-3" />
                    <span>{item.category || 'Positive Thought'}</span>
                  </span>

                  <button
                    onClick={() => onRemoveFavourite(item.id)}
                    className="p-2 rounded-xl text-[#705B51] hover:text-[#F08070] hover:bg-[#FCECE5]/60 transition-colors cursor-pointer"
                    title="Remove from favourites"
                    aria-label="Remove reminder from favourites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quote Content */}
                <div className="relative pl-6">
                  <Quote className="w-5 h-5 text-[#559C91]/30 absolute left-0 top-1 rotate-180" />
                  <p className="font-serif text-lg sm:text-xl font-semibold text-[#45362F] leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {item.supportingText && (
                  <p className="text-xs sm:text-sm text-[#705B51] pl-6 leading-relaxed font-normal">
                    {item.supportingText}
                  </p>
                )}

              </div>

              {/* Card Footer: Saved Date */}
              {item.savedAt && (
                <div className="pt-4 mt-4 border-t border-[#EADFCF]/60 flex items-center justify-between text-xs text-[#705B51]">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Clock className="w-3 h-3 text-[#559C91]" />
                    <span>Saved on {formatSavedDate(item.savedAt)}</span>
                  </span>
                  
                  <span className="text-[11px] font-semibold text-[#F08070] flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-[#F08070]" />
                    <span>Favorited</span>
                  </span>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
