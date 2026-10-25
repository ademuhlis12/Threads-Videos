import React, { useRef, useState, useEffect } from 'react';
import { audioEngine } from '../utils/audioSynth';
import { RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  onClose?: () => void;
}

const LETTERS = [
  { char: 'ب', name: 'Ba', meaning: 'Satu titik di bawah perahu', pathHint: 'Lengkungkan dari kanan ke kiri, lalu sentuh titik di bawah' },
  { char: 'ا', name: 'Alif', meaning: 'Tegak lurus seperti tiang', pathHint: 'Tarik garis lurus dari atas ke bawah' },
  { char: 'ت', name: 'Ta', meaning: 'Dua titik di atas perahu', pathHint: 'Lengkungkan dari kanan ke kiri, lalu sentuh dua titik di atas' },
];

export const MontessoriCanvas: React.FC<Props> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedLetter, setSelectedLetter] = useState(LETTERS[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);

  // Initialize canvas with fine sand texture
  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Sand background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#e8d5b5');
    gradient.addColorStop(0.5, '#dfc59f');
    gradient.addColorStop(1, '#d4b68a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Fine sand grain speckles
    for (let i = 0; i < 1800; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 1.5;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.4)' : 'rgba(120,80,30,0.15)';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Guide watermark outline of the letter
    ctx.font = 'bold 120px Amiri, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(160, 110, 60, 0.2)';
    ctx.fillText(selectedLetter.char, width / 2, height / 2);

    setStrokeCount(0);
  };

  useEffect(() => {
    resetCanvas();
  }, [selectedLetter]);

  const drawAtPoint = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Carved sand groove effect
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#b89462'; // deeper bottom of sand tray
    ctx.shadowColor = 'rgba(60, 40, 10, 0.4)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 2;
    ctx.fill();

    // Soft lighter edge where sand is pushed aside
    ctx.beginPath();
    ctx.arc(x - 2, y - 2, 18, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 248, 230, 0.5)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    audioEngine.playSandTraceSfx();
    setStrokeCount(prev => prev + 1);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawAtPoint(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawAtPoint(x, y);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  return (
    <div className="absolute inset-0 z-30 bg-stone-900/90 backdrop-blur-md p-4 flex flex-col justify-between text-stone-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Baki Pasir Montessori Interaktif
          </div>
          <div className="text-sm font-bold text-white">Raba & Tulis Huruf: {selectedLetter.name} ({selectedLetter.char})</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-md transition-colors"
          >
            Tutup Baki
          </button>
        )}
      </div>

      {/* Letter selector */}
      <div className="flex items-center justify-center gap-2 my-2">
        {LETTERS.map(letter => (
          <button
            key={letter.name}
            onClick={() => setSelectedLetter(letter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedLetter.name === letter.name
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            Huruf {letter.char} ({letter.name})
          </button>
        ))}
      </div>

      {/* Canvas Sand Tray */}
      <div className="relative mx-auto border-8 border-amber-950/70 rounded-2xl shadow-2xl overflow-hidden bg-[#dfc59f] touch-none">
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="cursor-crosshair block"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        <div className="absolute bottom-2 left-2 right-2 text-center pointer-events-none">
          <span className="text-[11px] bg-stone-900/70 text-amber-200 px-2 py-0.5 rounded shadow">
            {strokeCount > 15 ? '✨ MashaAllah! Jari mungil melatih memori otot!' : 'Sentuh & geser jari Anda untuk melukis di pasir'}
          </span>
        </div>
      </div>

      {/* Footer instruction & reset */}
      <div className="flex items-center justify-between text-xs text-stone-300 mt-2">
        <span className="italic max-w-[220px] truncate">{selectedLetter.pathHint}</span>
        <button
          onClick={resetCanvas}
          className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-amber-300 px-3 py-1.5 rounded-lg font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Ratakan Pasir
        </button>
      </div>
    </div>
  );
};
