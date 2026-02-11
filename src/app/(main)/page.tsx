'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useGetFunnelsQuery } from '@/store/api/funnelsApi';
import { useGetUserAnalyticsQuery } from '@/store/api/analyticsApi';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import { FunnelCard } from '@/components/ui/funnel-card';
import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonShimmer } from '@/components/ui/skeleton-shimmer';
import { PageTransition } from '@/components/ui/page-transition';
import { Plus, Layers, Users, CreditCard, TrendingUp, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function DashboardPage() {
  const { data: funnels, isLoading: funnelsLoading } = useGetFunnelsQuery({ limit: 3 });
  const { data: analytics, isLoading: analyticsLoading } = useGetUserAnalyticsQuery();

  const stats = [
    { icon: Layers, label: 'Воронки', value: analytics?.summary?.totalFunnels || 0 },
    { icon: Users, label: 'Лиды', value: analytics?.summary?.totalStarted || 0 },
    { icon: CreditCard, label: 'Оплаты', value: analytics?.summary?.totalPaid || 0 },
    { icon: TrendingUp, label: 'Доход', value: formatPrice(analytics?.summary?.totalRevenue || 0) },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold">Добро пожаловать!</h1>
          <p className="text-muted-foreground">Управляйте своими воронками продаж</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Button asChild className="w-full h-12 text-base" size="lg">
            <Link href="/funnels/new">
              <Plus className="w-5 h-5 mr-2" /> Создать воронку
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {analyticsLoading
            ? [1, 2, 3, 4].map(i => <SkeletonShimmer key={i} className="h-24" />)
            : stats.map((stat, i) => (
                <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} delay={i * 0.05} />
              ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Последние воронки</h2>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
              <Link href="/funnels">Все <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>

          {funnelsLoading ? (
            <div className="space-y-3">{[1, 2, 3].map(i => <SkeletonShimmer key={i} className="h-24" />)}</div>
          ) : funnels?.data.length === 0 ? (
            <EmptyState
              icon={<Layers className="w-10 h-10" />}
              title="Нет воронок"
              description="Создайте первую воронку, чтобы начать автоматизировать продажи"
              action={<Button asChild><Link href="/funnels/new"><Plus className="w-4 h-4 mr-2" /> Создать воронку</Link></Button>}
            />
          ) : (
            <div className="space-y-3">
              {funnels?.data.map((funnel, i) => <FunnelCard key={funnel.id} funnel={funnel} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
