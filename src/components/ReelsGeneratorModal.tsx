import React, { useState } from 'react';
import { StoryScene } from '../types/story';
import { Sparkles, X, Wand2, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplyTheme: (newScenes: StoryScene[]) => void;
}

const PRESET_THEMES = [
  {
    id: 'hp-montessori',
    title: 'Orang Tua Pegang HP vs Mengaji Montessori (Tema Utama)',
    desc: 'Anak meniru orang tua scrolling gadget, diubah menjadi belajar huruf hijaiyah lewat pasir sensori & kartu amplas.',
  },
  {
    id: 'shalat-subuh',
    title: 'Bangun Subuh & Shalat Berjamaah',
    desc: 'Orang tua tidak lagi hanya berteriak membangunkan anak, melainkan membasuh wajah dengan air wudhu hangat dan membentangkan sajadah bersama.',
  },
  {
    id: 'adab-makan',
    title: 'Anak Makan Sambil Main Gadget vs Adab Makan Bersama',
    desc: 'Menghentikan kebiasaan menyuapi anak di depan layar HP, kembali ke meja makan keluarga dengan adab basmalah & tangan kanan.',
  },
  {
    id: 'hafalan-surah',
    title: 'Hafalan Surah Pendek Melalui Gerak Tubuh & Montessori',
    desc: 'Menghafal Surah Al-Fatihah dan Al-Ikhlas dengan asosiasi gambar bermakna, bukan hafalan drill yang membosankan.',
  },
];

export const ReelsGeneratorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedThemeId, setSelectedThemeId] = useState('hp-montessori');
  const [childName, setChildName] = useState('Maryam');
  const [childAge, setChildAge] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setAppliedSuccess(true);
      setTimeout(() => {
        setAppliedSuccess(false);
        onClose();
      }, 1000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 text-stone-900 space-y-4 animate-in fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-base text-stone-900">Kustomisasi Episode Reels Parenting</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-stone-500">
          Sesuaikan profil karakter anak atau pilih variasi tema edukasi Islami berbasis keteladanan orang tua.
        </p>

        {/* Child Profile Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Buah Hati</label>
            <input
              type="text"
              value={childName}
              onChange={e => setChildName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
              placeholder="e.g. Maryam, Aisyah, Fatimah"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Usia Anak (Tahun)</label>
            <select
              value={childAge}
              onChange={e => setChildAge(Number(e.target.value))}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
            >
              <option value={4}>4 Tahun (Pra-sekolah awal)</option>
              <option value={5}>5 Tahun (Usia Emas Sensori)</option>
              <option value={6}>6 Tahun (Kesiapan Iqro/Quran)</option>
            </select>
          </div>
        </div>

        {/* Theme presets */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">Pilihan Tema Parenting</label>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {PRESET_THEMES.map(theme => (
              <div
                key={theme.id}
                onClick={() => setSelectedThemeId(theme.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedThemeId === theme.id
                    ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                    : 'border-stone-200 bg-stone-50/50 hover:border-stone-300'
                }`}
              >
                <div className="font-bold text-stone-900">{theme.title}</div>
                <p className="text-stone-600 mt-0.5 text-[11px] leading-relaxed">{theme.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors shadow-xs"
          >
            {appliedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Naskah Disesuaikan!</span>
              </>
            ) : isGenerating ? (
              <>
                <Wand2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Terapkan Profil {childName} ({childAge} thn)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
