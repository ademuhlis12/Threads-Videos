import React from 'react';
import { Copy, Sparkles, Check } from 'lucide-react';

interface Props {
  activeTab: 'reels' | 'script' | 'prompts' | 'guide';
  onSelectTab: (tab: 'reels' | 'script' | 'prompts' | 'guide') => void;
  onOpenSandbox: () => void;
}

export const TopNav: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  onOpenSandbox,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8 h-16">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            KQ
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('reels');
            }}
            className="text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0"
          >
            Keluarga Qur'ani
          </a>
        </div>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onSelectTab('reels')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'reels' ? 'text-amber-800 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            Simulator Reels
          </button>
          <button
            onClick={() => onSelectTab('script')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'script' ? 'text-amber-800 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            Naskah & Timeline
          </button>
          <button
            onClick={() => onSelectTab('prompts')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'prompts' ? 'text-amber-800 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            Studio Prompt AI
          </button>
          <button
            onClick={() => onSelectTab('guide')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'guide' ? 'text-amber-800 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            Panduan Montessori
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSandbox}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Coba Baki Pasir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
