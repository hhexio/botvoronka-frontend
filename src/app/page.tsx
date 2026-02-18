'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!isHydrated) return;
    if (isAuthenticated) {
      router.replace('/funnels');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}
