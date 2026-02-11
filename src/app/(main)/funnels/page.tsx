'use client';

import Link from 'next/link';
import { useGetFunnelsQuery } from '@/store/api/funnelsApi';
import { Button } from '@/components/ui/button';
import { FunnelCard } from '@/components/ui/funnel-card';
import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonShimmer } from '@/components/ui/skeleton-shimmer';
import { PageTransition } from '@/components/ui/page-transition';
import { Plus, Layers } from 'lucide-react';

export default function FunnelsPage() {
  const { data, isLoading } = useGetFunnelsQuery({ limit: 20 });

  return (
    <PageTransition>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Воронки</h1>
          <Button asChild size="sm">
            <Link href="/funnels/new"><Plus className="w-4 h-4 mr-1" /> Создать</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3, 4, 5].map(i => <SkeletonShimmer key={i} className="h-24" />)}</div>
        ) : data?.data.length === 0 ? (
          <EmptyState
            icon={<Layers className="w-10 h-10" />}
            title="Нет воронок"
            description="Создайте свою первую воронку продаж за несколько минут"
            action={<Button asChild><Link href="/funnels/new"><Plus className="w-4 h-4 mr-2" /> Создать воронку</Link></Button>}
          />
        ) : (
          <div className="space-y-3">
            {data?.data.map((funnel, i) => <FunnelCard key={funnel.id} funnel={funnel} index={i} />)}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
