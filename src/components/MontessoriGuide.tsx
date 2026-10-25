import React from 'react';
import { MONTESSORI_ISLAMIC_GUIDE } from '../data/storyData';
import { BookOpen, Sparkles, HeartHandshake, ShieldCheck, HelpCircle } from 'lucide-react';

interface Props {
  onOpenSandbox: () => void;
}

export const MontessoriGuide: React.FC<Props> = ({ onOpenSandbox }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <span>Pedagogi Montessori Mengaji untuk Anak Usia 4-6 Tahun</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Mengapa pendekatan taktil sensori berhasil mengatasi kecanduan gadget dan menumbuhkan cinta Al-Qur'an sejak dini.
          </p>
        </div>
        <button
          onClick={onOpenSandbox}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Coba Baki Pasir Sensori</span>
        </button>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MONTESSORI_ISLAMIC_GUIDE.map(item => (
          <div
            key={item.step}
            className="p-5 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-white hover:border-amber-300 transition-all space-y-3"
          >
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                {item.step}
              </span>
              <h3 className="text-sm font-bold text-stone-900">{item.title}</h3>
            </div>
            <div className="text-xs font-semibold text-stone-700">{item.subtitle}</div>
            <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">{item.content}</p>
            <div className="pt-2 border-t border-stone-200/80 text-xs text-amber-950 bg-amber-50/80 p-2.5 rounded-lg">
              <span className="font-bold">Tips Praktis Rumah Tangga: </span>
              <span>{item.actionableTip}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Box: Perbandingan Layar HP vs Montessori Hijaiyah */}
      <div className="mt-6 border border-stone-200 rounded-xl overflow-hidden text-xs">
        <div className="bg-stone-900 text-stone-100 p-3 font-bold flex items-center justify-between">
          <span>Tabel Analisis: Layar Smartphone vs Pembelajaran Taktil Montessori</span>
          <span className="text-[11px] font-normal text-stone-400">Dampak pada Otak Anak Usia 4-6 Tahun</span>
        </div>
        <div className="divide-y divide-stone-200">
          <div className="grid grid-cols-3 p-3 bg-stone-50 font-semibold text-stone-700">
            <div>Aspek Perkembangan</div>
            <div className="text-red-700">Layar Gadget / Smartphone</div>
            <div className="text-emerald-700">Metode Montessori Hijaiyah</div>
          </div>
          <div className="grid grid-cols-3 p-3 text-stone-600">
            <div className="font-medium text-stone-800">Stimulasi Sensorik</div>
            <div>Pasif 2D, over-stimulasi cahaya biru & dopamin instan.</div>
            <div>Multi-sensori: rabaan serat amplas, butiran pasir, suara makhraj nyata.</div>
          </div>
          <div className="grid grid-cols-3 p-3 text-stone-600">
            <div className="font-medium text-stone-800">Kesiapan Motorik Halus</div>
            <div>Hanya geser/tap jempol, otot tangan tidak terlatih menulis.</div>
            <div>Dua jari melatih arah penulisan khat Arab, memperkuat otot pra-menulis.</div>
          </div>
          <div className="grid grid-cols-3 p-3 text-stone-600">
            <div className="font-medium text-stone-800">Ikatan Kasih Sayang (Bonding)</div>
            <div>Anak terisolasi dalam layar, emosi menjadi mudah tantrum.</div>
            <div>Sentuhan tangan hangat orang tua, tatapan mata penuh cinta (eye contact).</div>
          </div>
          <div className="grid grid-cols-3 p-3 text-stone-600">
            <div className="font-medium text-stone-800">Koneksi Hati ke Al-Qur'an</div>
            <div>Al-Qur'an dianggap sebagai aplikasi beban tugas sekolah.</div>
            <div>Al-Qur'an diasosiasikan dengan kehangatan pelukan Ayah dan Bunda.</div>
          </div>
        </div>
      </div>

      {/* Hadith & Quotes */}
      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 space-y-1">
        <div className="font-bold flex items-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-amber-800" />
          <span>Hadits & Prinsip Keteladanan (Uswatun Hasanah):</span>
        </div>
        <p className="italic leading-relaxed text-stone-800 font-serif text-sm">
          "Setiap anak dilahirkan di atas fitrah. Kedua orang tuanyalah yang menjadikannya Yahudi, Nasrani, atau Majusi..."
          <span className="not-italic text-xs font-sans text-stone-500 block mt-0.5">(HR. Bukhari no. 1385)</span>
        </p>
      </div>
    </div>
  );
};
