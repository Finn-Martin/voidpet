'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href:'/',          label:'Home',      icon:'🏠' },
  { href:'/pets',      label:'Pets',      icon:'🐾' },
  { href:'/optimizer', label:'Optimize',  icon:'⚡' },
  { href:'/meta',      label:'Meta',      icon:'📊' },
  { href:'/gear',      label:'Gear',      icon:'🗡️' },
];

export default function Navigation() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="glass border-t border-void-700/50 px-1 pt-2 pb-2">
        <div className="flex justify-around max-w-lg mx-auto">
          {TABS.map(t => {
            const active = path === t.href || (t.href !== '/' && path.startsWith(t.href));
            return (
              <Link key={t.href} href={t.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl touch-target transition-all duration-200
                  ${active ? 'text-void-400 bg-void-800/60' : 'text-gray-500 hover:text-gray-300'}`}>
                <span className="text-xl leading-none">{t.icon}</span>
                <span className="text-[10px] font-semibold tracking-wide">{t.label}</span>
                {active && <span className="w-1 h-1 rounded-full bg-void-400 mt-0.5" />}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
