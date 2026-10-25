import React, { useState, useEffect, useRef } from 'react';
import { StoryScene } from '../types/story';
import { MontessoriCanvas } from './MontessoriCanvas';
import { audioEngine, IndonesianVoiceoverController } from '../utils/audioSynth';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  RotateCcw,
  Maximize2,
  Minimize2,
  Music,
  Check
} from 'lucide-react';

interface Props {
  scenes: StoryScene[];
  currentSceneIndex: number;
  onSceneChange: (index: number) => void;
}

export const ReelsPlayer: React.FC<Props> = ({
  scenes,
  currentSceneIndex,
  onSceneChange,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progressSec, setProgressSec] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVoiceoverEnabled, setIsVoiceoverEnabled] = useState<boolean>(true);
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(14820);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  const activeScene = scenes[currentSceneIndex] || scenes[0];
  const timerRef = useRef<number | null>(null);

  // Comments mock for Reels authenticity
  const COMMENTS = [
    { name: 'bunda_salma_88', text: 'MasyaAllah tertampar banget... Sering nyuruh anak ngaji sambil tangan sendiri scroll olshop 😢', time: '2j' },
    { name: 'dr.fahmi_parenting', text: 'Betul sekali, anak usia pra-sekolah merekam tindakan lebih dalam daripada kata-kata. Konsep modeling!', time: '4j' },
    { name: 'zahra_montessori', text: 'Kartu amplas & pasir kinetik memang game changer buat pengenalan huruf hijaiyah! Ga bikin frustasi.', time: '1h' },
    { name: 'abdurrahman_abi', text: 'Izin share ke grup keluarga ya min, sangat menginspirasi para orang tua muda.', time: '1h' },
  ];

  // Handle Play/Pause audio and speech
  useEffect(() => {
    if (isPlaying) {
      if (!isMuted) {
        audioEngine.startBgm();
      }
      if (isVoiceoverEnabled && activeScene) {
        IndonesianVoiceoverController.speak(activeScene.voiceoverId, 0.95 * playbackSpeed);
      }
    } else {
      audioEngine.stopBgm();
      IndonesianVoiceoverController.stop();
    }
  }, [isPlaying, currentSceneIndex, isVoiceoverEnabled, isMuted, playbackSpeed]);

  // Handle ticking progress
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 100;
    const step = (intervalMs / 1000) * playbackSpeed;

    timerRef.current = window.setInterval(() => {
      setProgressSec(prev => {
        const next = prev + step;
        if (next >= activeScene.duration) {
          // Move to next scene or loop
          if (currentSceneIndex < scenes.length - 1) {
            onSceneChange(currentSceneIndex + 1);
            audioEngine.playSceneChime();
            return 0;
          } else {
            // Loop back to start
            onSceneChange(0);
            audioEngine.playSceneChime();
            return 0;
          }
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeScene, currentSceneIndex, playbackSpeed, scenes.length, onSceneChange]);

  // Reset progress when scene changes externally
  useEffect(() => {
    setProgressSec(0);
  }, [currentSceneIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopBgm();
      IndonesianVoiceoverController.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleSound = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.startBgm();
    } else {
      setIsMuted(true);
      audioEngine.stopBgm();
    }
  };

  const toggleVoiceover = () => {
    if (isVoiceoverEnabled) {
      setIsVoiceoverEnabled(false);
      IndonesianVoiceoverController.stop();
    } else {
      setIsVoiceoverEnabled(true);
      IndonesianVoiceoverController.speak(activeScene.voiceoverId, 0.95 * playbackSpeed);
    }
  };

  const handleNextScene = () => {
    const nextIdx = (currentSceneIndex + 1) % scenes.length;
    onSceneChange(nextIdx);
    setProgressSec(0);
    audioEngine.playSceneChime();
  };

  const handlePrevScene = () => {
    const prevIdx = (currentSceneIndex - 1 + scenes.length) % scenes.length;
    onSceneChange(prevIdx);
    setProgressSec(0);
    audioEngine.playSceneChime();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `Reels Edukasi: "Orang Tua Pegang HP, Anak Ikut Pegang HP — Transformasi Mengaji Montessori"\n\nNaskah & Storyboard: ${window.location.href}`
    );
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  // Find active caption
  const currentCaption = activeScene.captions.find(
    c => progressSec >= c.startSec && progressSec < c.endSec
  ) || activeScene.captions[activeScene.captions.length - 1];

  return (
    <div className={`relative flex flex-col items-center justify-center transition-all ${isFullscreen ? 'fixed inset-0 z-50 bg-stone-950 p-2' : 'w-full'}`}>
      {/* Phone Mockup Frame */}
      <div
        className={`relative overflow-hidden bg-stone-900 border-[7px] border-stone-800 rounded-[38px] shadow-2xl flex flex-col justify-between transition-all select-none ${
          isFullscreen ? 'w-full max-w-[440px] h-[92vh]' : 'w-full max-w-[360px] sm:max-w-[380px] aspect-[9/16]'
        }`}
      >
        {/* Dynamic Scene Background with Subtle Cinematic Pan/Zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-stone-950">
          <img
            src={activeScene.imagePath}
            alt={activeScene.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-1000 ease-out transform scale-105 hover:scale-110"
            style={{
              transform: isPlaying ? `scale(${1.03 + (progressSec / activeScene.duration) * 0.05})` : 'scale(1.04)',
            }}
          />
          {/* Top Gradient Scrim for status bar and stories bar */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
          {/* Bottom Gradient Scrim for captions and text overlay */}
          <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none" />
        </div>

        {/* TOP STATUS BAR & SEGMENT PROGRESS */}
        <div className="relative z-20 pt-3 px-4 flex flex-col gap-2">
          {/* 5-Segment Progress Bar (Instagram / TikTok Reels style) */}
          <div className="flex items-center gap-1.5 w-full">
            {scenes.map((scene, idx) => {
              let fillPercent = 0;
              if (idx < currentSceneIndex) fillPercent = 100;
              else if (idx === currentSceneIndex) {
                fillPercent = Math.min(100, (progressSec / scene.duration) * 100);
              }
              return (
                <div
                  key={scene.id}
                  onClick={() => onSceneChange(idx)}
                  className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer backdrop-blur-xs"
                >
                  <div
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Top Bar: Title & Status */}
          <div className="flex items-center justify-between text-white text-xs mt-1">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wide uppercase text-[11px] text-amber-300">
                Scene {currentSceneIndex + 1} / {scenes.length}
              </span>
              <span className="text-white/60">·</span>
              <span className="text-white/80 text-[11px] truncate max-w-[170px]">{activeScene.title}</span>
            </div>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              title="Toggle Fullscreen View"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* CENTER INTERACTIVE TAP AREA (Play/Pause on screen tap) */}
        <div
          onClick={togglePlay}
          className="relative z-10 flex-1 flex items-center justify-center cursor-pointer"
        >
          {!isPlaying && (
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-xl transform scale-100 hover:scale-105 transition-transform">
              <Play className="w-8 h-8 ml-1 fill-white" />
            </div>
          )}
        </div>

        {/* RIGHT SIDE ACTION BUTTONS (Instagram Reels Mockup) */}
        <div className="absolute right-3 bottom-28 z-20 flex flex-col items-center gap-4 text-white">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex flex-col items-center group transition-transform active:scale-90"
          >
            <div className={`p-2.5 rounded-full ${isLiked ? 'bg-red-500/20 text-red-500' : 'bg-black/40 text-white group-hover:bg-black/60'} backdrop-blur-sm shadow-md`}>
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </div>
            <span className="text-[11px] font-semibold mt-1 drop-shadow-md">
              {(likeCount / 1000).toFixed(1)}k
            </span>
          </button>

          {/* Comments Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center group transition-transform active:scale-90"
          >
            <div className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm shadow-md">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold mt-1 drop-shadow-md">1.2k</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center group transition-transform active:scale-90"
          >
            <div className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm shadow-md">
              {copiedToast ? <Check className="w-6 h-6 text-emerald-400" /> : <Share2 className="w-6 h-6" />}
            </div>
            <span className="text-[11px] font-semibold mt-1 drop-shadow-md">
              {copiedToast ? 'Tersalin' : 'Share'}
            </span>
          </button>

          {/* Interactive Montessori Sandbox Toggle Button */}
          <button
            onClick={() => setIsSandboxOpen(!isSandboxOpen)}
            className="flex flex-col items-center group transition-transform active:scale-90"
            title="Buka Baki Pasir Montessori Interaktif"
          >
            <div className="p-2.5 rounded-full bg-amber-500/90 hover:bg-amber-400 text-stone-950 backdrop-blur-sm shadow-lg border border-amber-300">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[10px] font-bold mt-1 text-amber-200 drop-shadow-md whitespace-nowrap">
              Coba Pasir
            </span>
          </button>

          {/* Spinning Audio Vinyl Disc */}
          <div className="mt-1 flex items-center justify-center">
            <div className={`w-8 h-8 rounded-full border-2 border-white/80 bg-stone-950 flex items-center justify-center overflow-hidden shadow-lg ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA & ON-SCREEN CAPTIONS */}
        <div className="relative z-20 px-4 pb-4 flex flex-col gap-2">
          {/* Active Synced Subtitle / Caption Banner (High impact Reels text) */}
          <div className="min-h-[56px] flex items-center justify-center text-center px-2">
            {currentCaption && (
              <div className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 shadow-lg animate-fade-in">
                <span className="text-sm sm:text-base font-extrabold text-white tracking-wide drop-shadow-md">
                  {currentCaption.text.split(' ').map((word, i) => {
                    const isKeyword = ['PENIRU', 'ULUNG!', 'HP?', 'SENTUHAN', 'NYATA.', 'Montessori:', 'KETELADANAN.', 'Al-Qur\'an'].includes(word);
                    return (
                      <span key={i} className={isKeyword ? 'text-amber-300 font-black' : ''}>
                        {word}{' '}
                      </span>
                    );
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Account & Caption Details */}
          <div className="text-white text-xs max-w-[80%] space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-100 drop-shadow">@keluarga.qurani</span>
              <span className="text-[10px] px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded-md font-semibold cursor-pointer transition-colors">
                Ikuti
              </span>
            </div>
            <p className="text-[11px] text-white/90 line-clamp-2 leading-relaxed drop-shadow">
              Anak bukan pendengar perintah, melainkan peniru ulung. Gantilah gadget dengan baki pasir & kartu hijaiyah Montessori! 🌿✨ #ParentingMuslim #MontessoriHijaiyah #StopGadget
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-white/70">
              <Music className="w-3 h-3 text-amber-300" />
              <span className="truncate">Akustik Syahdu & Tilawah Indah · Audio Asli</span>
            </div>
          </div>

          {/* Quick Playback Bar at the bottom */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-white/90 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="hover:text-amber-300 transition-colors"
                title={isPlaying ? 'Jeda' : 'Putar'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
              <button
                onClick={handlePrevScene}
                className="hover:text-amber-300 transition-colors"
                title="Scene Sebelumnya"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextScene}
                className="hover:text-amber-300 transition-colors"
                title="Scene Selanjutnya"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Voiceover Speech Toggle */}
              <button
                onClick={toggleVoiceover}
                className={`p-1 rounded transition-colors ${isVoiceoverEnabled ? 'text-amber-300' : 'text-white/40'}`}
                title={isVoiceoverEnabled ? 'Voiceover TTS Aktif' : 'Voiceover TTS Hening'}
              >
                {isVoiceoverEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              </button>

              {/* Music Sound Toggle */}
              <button
                onClick={toggleSound}
                className={`p-1 rounded transition-colors ${!isMuted ? 'text-amber-300' : 'text-white/40'}`}
                title={!isMuted ? 'Musik BGM Aktif' : 'Musik BGM Hening'}
              >
                {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Speed Selector */}
              <button
                onClick={() => {
                  const speeds = [0.75, 1, 1.25];
                  const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                  setPlaybackSpeed(speeds[nextIdx]);
                }}
                className="px-1.5 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[10px] font-semibold text-white transition-colors"
                title="Kecepatan Putar"
              >
                {playbackSpeed}x
              </button>
            </div>
          </div>
        </div>

        {/* INTERACTIVE MONTESSORI SANDBOX MODAL */}
        {isSandboxOpen && (
          <MontessoriCanvas onClose={() => setIsSandboxOpen(false)} />
        )}

        {/* COMMENTS DRAWER */}
        {showComments && (
          <div className="absolute inset-x-0 bottom-0 top-1/3 z-30 bg-stone-900/95 backdrop-blur-md rounded-t-3xl border-t border-stone-700 p-4 flex flex-col justify-between text-stone-100 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="text-xs font-bold text-stone-200">Komentar Orang Tua (1.2k)</span>
              <button
                onClick={() => setShowComments(false)}
                className="text-stone-400 hover:text-white text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
              {COMMENTS.map((c, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
                    <span className="font-semibold text-stone-200">@{c.name}</span>
                    <span>· {c.time}</span>
                  </div>
                  <p className="text-stone-300 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-stone-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Tulis tanggapan Ayah / Bunda..."
                className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
              <button className="text-xs font-semibold text-amber-400 px-2 py-1">Kirim</button>
            </div>
          </div>
        )}
      </div>

      {/* External Sub-Controls under the phone */}
      <div className="mt-3 flex items-center justify-center gap-3 text-xs text-stone-500">
        <button
          onClick={() => {
            onSceneChange(0);
            setProgressSec(0);
            setIsPlaying(true);
          }}
          className="flex items-center gap-1.5 hover:text-stone-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Putar Dari Awal</span>
        </button>
        <span aria-hidden="true">·</span>
        <span>Durasi Total: 34 Detik (Format Reels / Shorts)</span>
      </div>
    </div>
  );
};
