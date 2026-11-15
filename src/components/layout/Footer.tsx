import { IS_MOCK } from '../../api/client';

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <p className="font-display text-2xl tracking-wide">
              PIT<span className="text-accent">PREDICT</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Antarmuka skripsi: prediksi pit stop Formula 1 dengan model hybrid
              XGBoost–LSTM (musim 2021–2025). Seluruh keluaran adalah{' '}
              <strong className="text-ink">prediksi</strong> berbasis keputusan balapan
              aktual (data observasional) — bukan strategi optimal secara matematis.
            </p>
          </div>
          <div className="text-sm text-muted">
            <p className="label-mono mb-2">Sumber data (direncanakan)</p>
            <ul className="space-y-1">
              <li>Jolpica F1 API</li>
              <li>FastF1 (telemetri & stint ban)</li>
            </ul>
            {IS_MOCK && (
              <p className="mt-4 inline-block rounded-full border border-medium/40 bg-medium/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-medium">
                Saat ini: data demo (mock)
              </p>
            )}
          </div>
        </div>
        <p className="mt-8 border-t border-line pt-6 font-mono text-xs text-muted/70">
          Tidak berafiliasi dengan Formula 1 atau tim mana pun. Nama tim/pembalap
          digunakan sebagai teks referensial; seluruh visual adalah ilustrasi buatan sendiri.
        </p>
      </div>
    </footer>
  );
}
