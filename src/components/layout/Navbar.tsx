import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IS_MOCK } from '../../api/client';

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/console', label: 'Konsol Prediksi' },
  { to: '/model', label: 'Tentang Model' },
];

function Logo() {
  return (
    <NavLink to="/" className="flex items-center gap-2.5" aria-label="PitPredict — beranda">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#12121a" stroke="#26262f" />
        <path d="M8 23 L16 7 L20.5 7 L12.5 23 Z" fill="var(--accent)" />
        <path d="M16.5 23 L22.5 11 L25 11 L19 23 Z" fill="#f4f4f6" />
      </svg>
      <span className="font-display text-2xl leading-none tracking-wide">
        PIT<span className="text-accent">PREDICT</span>
      </span>
    </NavLink>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Navigasi utama">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className="relative px-2 py-2 sm:px-3">
              {({ isActive }) => (
                <>
                  <span
                    className={`text-[13px] font-semibold transition-colors duration-200 sm:text-sm ${
                      isActive ? 'text-ink' : 'text-muted hover:text-ink'
                    }`}
                  >
                    <span className="hidden sm:inline">{l.label}</span>
                    <span className="sm:hidden">{l.label.split(' ')[0]}</span>
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
          {IS_MOCK && (
            <span
              className="ml-2 hidden rounded-full border border-medium/40 bg-medium/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-medium md:inline-block"
              title="Antarmuka berjalan dengan data mock — model belum dilatih"
            >
              Data demo
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}
