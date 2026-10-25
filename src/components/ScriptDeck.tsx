import React, { useState } from 'react';
import { StoryScene } from '../types/story';
import { Copy, Check, Download, Play, Mic, Film } from 'lucide-react';
import { IndonesianVoiceoverController } from '../utils/audioSynth';

interface Props {
  scenes: StoryScene[];
  activeSceneIndex: number;
  onSelectScene: (idx: number) => void;
}

export const ScriptDeck: React.FC<Props> = ({
  scenes,
  activeSceneIndex,
  onSelectScene,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSceneId, setCopiedSceneId] = useState<number | null>(null);

  // Copy full script for CapCut or Instagram Caption
  const handleCopyFullScript = () => {
    let scriptText = '🎬 NASKAH LENGKAP REELS EDUKASI MUSLIM: DARI GADGET KE MENGAJI MONTESSORI\n';
    scriptText += 'Format: 9:16 Vertical Reels / Shorts / TikTok\n';
    scriptText += 'Target Durasi: 34 Detik | Usia Target Anak: 4-6 Tahun\n';
    scriptText += '==================================================\n\n';

    scenes.forEach(scene => {
      scriptText += `[SCENE ${scene.id}: ${scene.title.toUpperCase()} (${scene.timecode})]\n`;
      scriptText += `📹 Visual Shot: ${scene.cameraShot}\n`;
      scriptText += `👁️ Arahan Visual: ${scene.visualDirection}\n`;
      scriptText += `🎙️ Voiceover (VO): "${scene.voiceoverId}"\n`;
      scriptText += `📝 Teks di Layar (Subtitle): ${scene.captions.map(c => c.text).join(' -> ')}\n`;
      scriptText += `🎵 Sound FX & Musik: ${scene.sfxCues}\n\n`;
    });

    scriptText += '==================================================\n';
    scriptText += 'CAPTION INSTAGRAM / TIKTOK REELS:\n';
    scriptText += 'Mau anak rajin mengaji tapi tangan kita sendiri sibuk scrolling HP? 📱💔\n\n';
    scriptText += 'Anak usia 4-6 tahun bukanlah pendengar perintah yang baik, melainkan peniru yang sangat ulung. Apa yang sering kita genggam, itulah yang akan dia minta.\n\n';
    scriptText += 'Mari ubah layar gadget dengan sentuhan nyata: Metode Montessori Hijaiyah (Sandpaper Letters & Sensory Sand Tray). Belajar mengaji dengan gembira, meraba tekstur huruf, tanpa bentakan!\n\n';
    scriptText += '#ParentingMuslim #MontessoriIslam #MengajiMontessori #StopGadgetAnak #ParentingQurani #KeluargaSakinah #IdeMainAnak';

    navigator.clipboard.writeText(scriptText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Export SRT file for CapCut / Premiere / DaVinci Resolve
  const handleDownloadSrt = () => {
    let srtContent = '';
    let counter = 1;
    let accumulatedSec = 0;

    const formatSrtTime = (seconds: number) => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      const millis = Math.floor((seconds % 1) * 1000);
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
    };

    scenes.forEach(scene => {
      scene.captions.forEach(caption => {
        const start = accumulatedSec + caption.startSec;
        const end = accumulatedSec + caption.endSec;
        srtContent += `${counter}\n`;
        srtContent += `${formatSrtTime(start)} --> ${formatSrtTime(end)}\n`;
        srtContent += `${caption.text}\n\n`;
        counter++;
      });
      accumulatedSec += scene.duration;
    });

    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'subtitles_reels_montessori_hijaiyah.srt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyScene = (scene: StoryScene) => {
    const text = `[Scene ${scene.id}: ${scene.title}]\nVisual: ${scene.visualDirection}\nVO: ${scene.voiceoverId}\nOn-Screen: ${scene.captions.map(c => c.text).join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopiedSceneId(scene.id);
    setTimeout(() => setCopiedSceneId(null), 2000);
  };

  const handlePreviewVoice = (text: string) => {
    IndonesianVoiceoverController.speak(text, 0.95);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Naskah Sutradara & Timeline Storyboard
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Panduan produksi detail 5 adegan Reels: instruksi kamera, naskah suara (VO), durasi, dan sound design.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyFullScript}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Naskah Tersalin!' : 'Salin Naskah'}</span>
          </button>
          <button
            onClick={handleDownloadSrt}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Subtitle (.SRT)</span>
          </button>
        </div>
      </div>

      {/* Scene list */}
      <div className="mt-6 space-y-4">
        {scenes.map((scene, idx) => {
          const isActive = idx === activeSceneIndex;
          return (
            <div
              key={scene.id}
              className={`p-4 rounded-xl border transition-all ${
                isActive
                  ? 'border-amber-400 bg-amber-50/40 shadow-xs'
                  : 'border-stone-200 bg-stone-50/50 hover:border-stone-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-stone-900 text-white text-xs font-bold">
                    {scene.id}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <span>{scene.title}</span>
                      {isActive && (
                        <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded">
                          Sedang Diputar di Reels
                        </span>
                      )}
                    </h3>
                    <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                      <span>Durasi: {scene.duration}s</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{scene.timecode}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onSelectScene(idx)}
                    className="p-1.5 rounded-md hover:bg-stone-200 text-stone-600 transition-colors"
                    title="Putar adegan ini di simulator Reels"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePreviewVoice(scene.voiceoverId)}
                    className="p-1.5 rounded-md hover:bg-stone-200 text-stone-600 transition-colors"
                    title="Dengar voiceover bahasa Indonesia"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyScene(scene)}
                    className="p-1.5 rounded-md hover:bg-stone-200 text-stone-600 transition-colors"
                    title="Salin adegan ini"
                  >
                    {copiedSceneId === scene.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Scene Details Grid */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Visual Shot Column */}
                <div className="bg-white p-3 rounded-lg border border-stone-200/80 space-y-1.5">
                  <div className="font-semibold text-stone-700 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-amber-600" />
                    <span>Visual & Arahan Kamera</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">{scene.visualDirection}</p>
                  <div className="text-[11px] text-stone-500 font-medium pt-1">
                    Kamera: <span className="font-mono text-stone-700">{scene.cameraShot}</span>
                  </div>
                </div>

                {/* Voiceover & Subtitles Column */}
                <div className="bg-white p-3 rounded-lg border border-stone-200/80 space-y-1.5">
                  <div className="font-semibold text-stone-700 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Voiceover (Naskah Narasi)</span>
                  </div>
                  <p className="text-stone-800 italic leading-relaxed">"{scene.voiceoverId}"</p>
                  <div className="pt-1 text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-700">Teks di Layar: </span>
                    {scene.captions.map(c => c.text).join(' · ')}
                  </div>
                </div>
              </div>

              {/* Sound & Montessori Pedagogical Notes */}
              <div className="mt-2 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-stone-500 bg-stone-100/60 px-3 py-1.5 rounded-md">
                <div>
                  <span className="font-semibold text-stone-600">Audio/SFX: </span>
                  <span>{scene.sfxCues}</span>
                </div>
                {scene.montessoriNote && (
                  <div className="text-[11px] text-amber-800">
                    <span className="font-semibold">Catatan Edukasi: </span>
                    <span>{scene.montessoriNote}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
