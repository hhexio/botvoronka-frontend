'use client';

import { useAppSelector } from '@/store';
import { useGetSubscriptionQuery } from '@/store/api/billingApi';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { user } = useAppSelector(state => state.auth);
  const { data: subscription } = useGetSubscriptionQuery();

  return (
    <header className="sticky top-0 z-50 bg-white border-b px-4 py-3">
      <div className="flex items-center gap-3">
        {user?.avatarUrl && <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full" />}
        <div className="flex-1">
          <p className="font-medium text-sm">{user?.firstName || 'Пользователь'}</p>
        </div>
        <Badge variant={subscription?.plan === 'PRO' ? 'default' : 'secondary'}>{subscription?.plan || 'FREE'}</Badge>
      </div>
    </header>
  );
}
