import React, { useState } from 'react';
import { TopNav } from './components/TopNav';
import { ReelsPlayer } from './components/ReelsPlayer';
import { ScriptDeck } from './components/ScriptDeck';
import { AiPromptsDeck } from './components/AiPromptsDeck';
import { MontessoriGuide } from './components/MontessoriGuide';
import { MontessoriCanvas } from './components/MontessoriCanvas';
import { ReelsGeneratorModal } from './components/ReelsGeneratorModal';
import { REELS_SCENES } from './data/storyData';
import { StoryScene } from './types/story';
import {
  Film,
  Sparkles,
  SlidersHorizontal,
  BookOpen,
  Volume2,
  Clock,
  Smartphone,
  Copy,
  Check,
  ChevronRight,
  Heart
} from 'lucide-react';

export default function App() {
  const [scenes, setScenes] = useState<StoryScene[]>(REELS_SCENES);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'reels' | 'script' | 'prompts' | 'guide'>('reels');
  const [isSandboxModalOpen, setIsSandboxModalOpen] = useState<boolean>(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState<boolean>(false);
  const [copiedCaptionToast, setCopiedCaptionToast] = useState<boolean>(false);

  const activeScene = scenes[activeSceneIndex] || scenes[0];

  const handleCopyCaption = () => {
    const caption = `Mau anak rajin mengaji tapi tangan kita sendiri sibuk scrolling HP? 📱💔

Anak usia 4-6 tahun bukanlah pendengar perintah yang baik, melainkan peniru yang sangat ulung. Apa yang sering kita genggam, itulah yang akan dia minta.

Ganti layar gadget dengan sentuhan nyata: Metode Montessori Hijaiyah (Sandpaper Letters & Sensory Sand Tray). Belajar mengaji dengan gembira, meraba tekstur huruf, tanpa bentakan!

#ParentingMuslim #MontessoriIslam #MengajiMontessori #StopGadgetAnak #ParentingQurani #KeluargaSakinah #IdeMainAnak`;
    navigator.clipboard.writeText(caption);
    setCopiedCaptionToast(true);
    setTimeout(() => setCopiedCaptionToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-stone-900 flex flex-col font-sans antialiased selection:bg-amber-200">
      {/* 3-Zone Top Navigation Contract */}
      <TopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSandbox={() => setIsSandboxModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Editorial Subheader / Concept Banner */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
                <span>Story & Video Reels Konseptual</span>
                <span aria-hidden="true">·</span>
                <span>Usia Anak: 4-6 Tahun</span>
                <span aria-hidden="true">·</span>
                <span>Metode Montessori Hijaiyah</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight text-balance">
                "Anak Bukan Pendengar Perintah, Tapi Peniru Ulung"
              </h1>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Transformasi edukasi keluarga muslim: Ketika orang tua meletakkan layar smartphone, menghadirkan baki pasir sensori dan kartu huruf amplas hijaiyah, anak perempuan usia 4-6 tahun tumbuh mencintai Al-Qur'an melalui keteladanan dan sentuhan nyata.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setIsCustomizeModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-stone-600" />
                <span>Kustomisasi Karakter</span>
              </button>
              <button
                onClick={handleCopyCaption}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                {copiedCaptionToast ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-600" />}
                <span>{copiedCaptionToast ? 'Caption Tersalin!' : 'Salin Caption Reels'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Studio Workspace: Split 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 9:16 Video Reels Live Simulator */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3 px-1 text-xs text-stone-500">
              <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-amber-700" />
                Preview Video Reels (9:16)
              </span>
              <span className="font-mono tabular-nums">00:34 Total</span>
            </div>

            {/* The Reels Simulator Phone Component */}
            <ReelsPlayer
              scenes={scenes}
              currentSceneIndex={activeSceneIndex}
              onSceneChange={setActiveSceneIndex}
            />

            {/* Quick Interactive Scene Picker Cards */}
            <div className="w-full max-w-[380px] mt-4 space-y-2">
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider px-1">
                Lompat ke Adegan:
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {scenes.map((scene, idx) => (
                  <button
                    key={scene.id}
                    onClick={() => setActiveSceneIndex(idx)}
                    className={`p-1.5 rounded-lg border text-center transition-all ${
                      idx === activeSceneIndex
                        ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <div className="text-xs font-bold">Sc {scene.id}</div>
                    <div className="text-[10px] text-stone-400 font-mono">{scene.duration}s</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Content & Director Decks */}
          <div className="lg:col-span-7 space-y-6">
            {/* Navigation Tabs (Functional interactive segmented control) */}
            <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-xl max-w-xl">
              <button
                onClick={() => setActiveTab('reels')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  activeTab === 'reels'
                    ? 'bg-white text-stone-900 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Overview Scene
              </button>
              <button
                onClick={() => setActiveTab('script')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  activeTab === 'script'
                    ? 'bg-white text-stone-900 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Naskah & Timeline
              </button>
              <button
                onClick={() => setActiveTab('prompts')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  activeTab === 'prompts'
                    ? 'bg-white text-stone-900 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Prompt AI Video
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  activeTab === 'guide'
                    ? 'bg-white text-stone-900 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Pedagogi Montessori
              </button>
            </div>

            {/* TAB CONTENT 1: Overview Scene Spotlight */}
            {activeTab === 'reels' && (
              <div className="space-y-4">
                {/* Active Scene Spotlight Card */}
                <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div>
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                        Fokus Adegan Aktif · Scene {activeScene.id}
                      </span>
                      <h2 className="text-xl font-bold text-stone-900 mt-0.5">{activeScene.title}</h2>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs text-stone-500 tabular-nums">{activeScene.timecode}</span>
                      <div className="text-xs font-semibold text-emerald-700">{activeScene.duration} Detik</div>
                    </div>
                  </div>

                  {/* Scene Image Preview & Visual Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative aspect-[9/16] max-h-60 rounded-xl overflow-hidden border border-stone-200 shadow-xs">
                      <img
                        src={activeScene.imagePath}
                        alt={activeScene.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-3 text-xs">
                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 space-y-1">
                        <span className="font-bold text-stone-800">Deskripsi Shot Visual:</span>
                        <p className="text-stone-600 leading-relaxed">{activeScene.visualDirection}</p>
                        <div className="text-stone-500 pt-1 font-mono">{activeScene.cameraShot}</div>
                      </div>

                      <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 space-y-1">
                        <span className="font-bold text-amber-950">Voiceover (Bahasa Indonesia):</span>
                        <p className="text-stone-800 italic leading-relaxed">"{activeScene.voiceoverId}"</p>
                      </div>

                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 space-y-1">
                        <span className="font-bold text-stone-800">Teks di Layar (Captions):</span>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {activeScene.captions.map((c, i) => (
                            <span key={i} className="bg-white border border-stone-200 text-stone-700 px-2 py-0.5 rounded text-[11px]">
                              {c.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Montessori Interactive Trigger Card */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="font-bold text-base text-amber-950 flex items-center gap-2 justify-center sm:justify-start">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Uji Coba Taktil: Baki Pasir & Kartu Huruf Hijaiyah</span>
                    </h3>
                    <p className="text-xs text-amber-900 max-w-xl">
                      Rasakan sensasi rabaan jari huruf Arab Alif, Ba, Ta pada baki pasir sensori secara interaktif dengan efek suara ASMR pasir halus.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSandboxModalOpen(true)}
                    className="px-4 py-2.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Buka Baki Pasir Sekarang
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: Full Script & Director's Cut Deck */}
            {activeTab === 'script' && (
              <ScriptDeck
                scenes={scenes}
                activeSceneIndex={activeSceneIndex}
                onSelectScene={setActiveSceneIndex}
              />
            )}

            {/* TAB CONTENT 3: AI Video Generation Prompts */}
            {activeTab === 'prompts' && (
              <AiPromptsDeck scenes={scenes} />
            )}

            {/* TAB CONTENT 4: Montessori Pedagogical Guide */}
            {activeTab === 'guide' && (
              <MontessoriGuide onOpenSandbox={() => setIsSandboxModalOpen(true)} />
            )}
          </div>
        </div>

        {/* Storyboard Strip: Visual Timeline of all 5 Scenes */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-stone-900 text-base">Alur Cerita Visual (Storyboard 5 Adegan)</h3>
              <p className="text-xs text-stone-500">Klik adegan untuk berpindah tayangan langsung di simulator video Reels.</p>
            </div>
            <div className="text-xs text-stone-400 font-medium">
              5 Adegan · Durasi 34 Detik
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {scenes.map((scene, idx) => (
              <div
                key={scene.id}
                onClick={() => {
                  setActiveSceneIndex(idx);
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className={`group cursor-pointer rounded-xl border overflow-hidden transition-all ${
                  idx === activeSceneIndex
                    ? 'border-amber-500 ring-2 ring-amber-400/30 shadow-md'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="relative aspect-[9/16] overflow-hidden bg-stone-900">
                  <img
                    src={scene.imagePath}
                    alt={scene.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Sc {scene.id}
                  </div>
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-amber-300 text-[10px] font-mono px-1.5 py-0.5 rounded">
                    {scene.duration}s
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                    <div className="text-[11px] font-bold truncate">{scene.title}</div>
                    <div className="text-[10px] text-white/70 truncate">{scene.cameraShot}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Standalone Montessori Sand Tray Modal */}
      {isSandboxModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md h-[560px] rounded-3xl overflow-hidden shadow-2xl border border-stone-800">
            <MontessoriCanvas onClose={() => setIsSandboxModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Customize Reels Episode Modal */}
      <ReelsGeneratorModal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
        onApplyTheme={newScenes => setScenes(newScenes)}
      />

      {/* Clean Minimalist Footer */}
      <footer className="mt-12 border-t border-stone-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">Keluarga Qur'ani</span>
            <span aria-hidden="true">·</span>
            <span>Studio Edukasi Reels Parenting & Montessori Islam</span>
          </div>
          <div>
            Format Siap Ekspor untuk Instagram Reels, YouTube Shorts & TikTok
          </div>
        </div>
      </footer>
    </div>
  );
}
