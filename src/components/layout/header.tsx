'use client';

import { useAppSelector } from '@/store';
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const { user } = useAppSelector(state => state.auth);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <span className="text-white font-bold text-sm">BV</span>
            </div>
            <span className="font-semibold hidden sm:inline">BotVoronka</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user && (
            <div className="flex items-center gap-3">
              <Badge variant={user.plan === 'PRO' ? 'default' : 'secondary'} className="hidden sm:flex">
                {user.plan}
              </Badge>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
