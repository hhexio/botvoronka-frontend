'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useGetUserAnalyticsQuery } from '@/store/api/analyticsApi';
import { useAppSelector } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonShimmer } from '@/components/ui/skeleton-shimmer';
import { PageTransition } from '@/components/ui/page-transition';
import { Plus, Layers, Users, TrendingUp, Zap, ArrowRight, Activity, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { RecentSession } from '@/types';

const STATUS_CONFIG: Record<RecentSession['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }> = {
  ACTIVE:    { label: 'Активна',   variant: 'default',     icon: Activity },
  COMPLETED: { label: 'Завершена', variant: 'secondary',   icon: CheckCircle2 },
  ABANDONED: { label: 'Брошена',   variant: 'destructive', icon: XCircle },
  PAID:      { label: 'Оплачено',  variant: 'outline',     icon: Zap },
};

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'только что';
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  return `${days} д назад`;
}

function formatTodayDate(): string {
  return new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function DashboardPage() {
  const user = useAppSelector(state => state.auth.user);
  const { data: analytics, isLoading } = useGetUserAnalyticsQuery();

  const firstName = user?.firstName || user?.username;
  const greeting = firstName ? `Привет, ${firstName}!` : 'Привет!';

  const stats = [
    { icon: Layers,     label: 'Воронки',   value: analytics?.summary?.totalFunnels   ?? 0 },
    { icon: Zap,        label: 'Активные',  value: analytics?.summary?.activeFunnels  ?? 0 },
    { icon: Users,      label: 'Лиды',      value: analytics?.summary?.totalStarted   ?? 0 },
    { icon: TrendingUp, label: 'Доход',     value: formatPrice(analytics?.summary?.totalRevenue ?? 0) },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold">{greeting}</h1>
          <p className="text-sm text-muted-foreground capitalize">{formatTodayDate()}</p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {isLoading
            ? [1, 2, 3, 4].map(i => <SkeletonShimmer key={i} className="h-24" />)
            : stats.map((stat, i) => (
                <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} delay={i * 0.05} />
              ))}
        </div>

        {/* Quick actions */}
        <motion.div
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button asChild size="lg" className="h-12">
            <Link href="/funnels/new">
              <Plus className="w-4 h-4 mr-2" /> Создать
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12">
            <Link href="/funnels">
              <Layers className="w-4 h-4 mr-2" /> Воронки
            </Link>
          </Button>
        </motion.div>

        {/* Recent activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Активность</h2>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
              <Link href="/analytics">Ещё <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <SkeletonShimmer key={i} className="h-16" />)}
            </div>
          ) : !analytics?.recentSessions?.length ? (
            <EmptyState
              icon={<Clock className="w-10 h-10" />}
              title="Нет активности"
              description="Здесь появятся последние сессии ваших воронок"
            />
          ) : (
            <div className="space-y-2">
              {analytics.recentSessions.map((session, i) => {
                const cfg = STATUS_CONFIG[session.status] ?? STATUS_CONFIG.ACTIVE;
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{session.visitorName}</p>
                            <p className="text-xs text-muted-foreground truncate">{session.funnelName}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <Badge variant={cfg.variant} className="text-xs">{cfg.label}</Badge>
                            <span className="text-xs text-muted-foreground">{formatRelativeTime(session.startedAt)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </PageTransition>
  );
}
