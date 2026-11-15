import { Hero } from '../components/home/Hero';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { IS_MOCK } from '../api/client';

export default function Home() {
  return (
    <>
      <Hero />
      {IS_MOCK && (
        <div className="border-y border-medium/20 bg-medium/5">
          <p className="mx-auto max-w-7xl px-4 py-3 text-center font-mono text-xs text-medium sm:px-6">
            ⚠ Mode data demo aktif — model belum dilatih, seluruh angka prediksi adalah simulasi
            antarmuka dan bukan klaim akurasi apa pun.
          </p>
        </div>
      )}
      <FeaturesSection />
    </>
  );
}
