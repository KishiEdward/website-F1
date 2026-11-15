import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PageTransition } from './components/layout/PageTransition';
import { useLenis } from './hooks/useLenis';
import Home from './pages/Home';
import Console from './pages/Console';
import Model from './pages/Model';

export default function App() {
  useLenis();
  const location = useLocation();
  const reduced = useReducedMotion();

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (v: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname} reduced={!!reduced}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/console" element={<Console />} />
              <Route path="/model" element={<Model />} />
            </Routes>
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
