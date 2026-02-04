'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, BarChart3, CreditCard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/', icon: Home, label: 'Главная' },
  { href: '/funnels', icon: Layers, label: 'Воронки' },
  { href: '/analytics', icon: BarChart3, label: 'Аналитика' },
  { href: '/billing', icon: CreditCard, label: 'Тариф' },
  { href: '/settings', icon: Settings, label: 'Ещё' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-2 py-2 pb-safe z-50">
      <div className="flex justify-around">
        {items.map(item => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('flex flex-col items-center gap-1 px-3 py-1', isActive ? 'text-primary' : 'text-gray-500')}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
