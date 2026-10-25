import React, { useState } from 'react';
import { StoryScene } from '../types/story';
import { Sparkles, Copy, Check, Clapperboard } from 'lucide-react';

interface Props {
  scenes: StoryScene[];
}

export const AiPromptsDeck: React.FC<Props> = ({ scenes }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<'veo' | 'runway' | 'kling' | 'midjourney'>('veo');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const all = scenes.map(s => `[SCENE ${s.id} - ${s.title}]\nPROMPT (EN): ${s.aiVideoPromptEn}\nPROMPT (ID): ${s.aiVideoPromptId}`).join('\n\n---\n\n');
    navigator.clipboard.writeText(all);
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>Studio Prompt Video AI (Veo 2, Runway, Kling, Sora)</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Prompt video sinematik vertikal (9:16) beresolusi tinggi siap pakai untuk di-generate menjadi video nyata.
          </p>
        </div>
        <button
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          {copiedId === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedId === 'all' ? 'Semua Prompt Tersalin!' : 'Salin Semua Prompt (Scene 1-5)'}</span>
        </button>
      </div>

      {/* Target Model Selector Tabs */}
      <div className="flex items-center gap-2 mt-4 p-1 bg-stone-100 rounded-lg max-w-md">
        <button
          onClick={() => setSelectedTool('veo')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
            selectedTool === 'veo' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Google Veo 2
        </button>
        <button
          onClick={() => setSelectedTool('runway')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
            selectedTool === 'runway' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Runway Gen-3
        </button>
        <button
          onClick={() => setSelectedTool('kling')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
            selectedTool === 'kling' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Kling / Sora
        </button>
        <button
          onClick={() => setSelectedTool('midjourney')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
            selectedTool === 'midjourney' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Midjourney v6
        </button>
      </div>

      {/* Prompts list */}
      <div className="mt-6 space-y-4">
        {scenes.map(scene => {
          let modelSpecificSuffix = '';
          if (selectedTool === 'midjourney') {
            modelSpecificSuffix = ' --ar 9:16 --style raw --v 6.1 --s 250';
          } else if (selectedTool === 'runway') {
            modelSpecificSuffix = ' [Camera: Slow Pan / Push-In, Motion Scale: 4, 9:16 Vertical, 4k]';
          } else if (selectedTool === 'veo') {
            modelSpecificSuffix = ' [Aspect Ratio: 9:16, 60fps, Cinematic Photorealism, Ultra-detailed skin textures]';
          } else {
            modelSpecificSuffix = ' [Aspect Ratio: 9:16, Professional lighting, Smooth physics motion]';
          }

          const fullEnPrompt = `${scene.aiVideoPromptEn}${modelSpecificSuffix}`;

          return (
            <div key={scene.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                    {scene.id}
                  </span>
                  <span className="text-sm font-bold text-stone-900">Scene {scene.id}: {scene.title}</span>
                  <span className="text-xs text-stone-500 font-mono">({scene.timecode})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(fullEnPrompt, `en-${scene.id}`)}
                    className="flex items-center gap-1 text-xs text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    {copiedId === `en-${scene.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Salin Prompt (English)</span>
                  </button>
                  <button
                    onClick={() => handleCopy(scene.aiVideoPromptId, `id-${scene.id}`)}
                    className="flex items-center gap-1 text-xs text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    {copiedId === `id-${scene.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Salin Prompt (ID)</span>
                  </button>
                </div>
              </div>

              {/* Code-like Prompt Box */}
              <div className="p-3 bg-stone-900 text-stone-100 rounded-lg text-xs font-mono leading-relaxed overflow-x-auto select-all">
                {fullEnPrompt}
              </div>

              {/* Translation in Indonesian */}
              <div className="text-xs text-stone-600 italic bg-white p-2.5 rounded-lg border border-stone-200">
                <span className="font-semibold text-stone-700 not-italic">Terjemahan Prompt: </span>
                {scene.aiVideoPromptId}
              </div>
            </div>
          );
        })}
      </div>

      {/* Generator instructions note */}
      <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
        <div className="font-bold flex items-center gap-1.5 text-amber-950">
          <Clapperboard className="w-4 h-4 text-amber-800" />
          <span>Tips Eksekusi Produksi Video:</span>
        </div>
        <p>
          1. <strong>Konsistensi Karakter:</strong> Di Runway Gen-3 atau Midjourney, gunakan referensi gambar Scene 1 (anak perempuan berhijab pastel) sebagai <em>Image-to-Video</em> atau <em>Character Reference (--cref)</em> agar paras anak dan hijab konsisten di semua scene.
        </p>
        <p>
          2. <strong>Rasio 9:16 Vertikal:</strong> Pastikan memilih orientasi Portrait / 9:16 untuk hasil optimal di Instagram Reels, YouTube Shorts, dan TikTok.
        </p>
      </div>
    </div>
  );
};
