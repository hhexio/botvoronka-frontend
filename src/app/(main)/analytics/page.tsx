'use client';

import { useSearchParams } from 'next/navigation';
import { useGetUserAnalyticsQuery, useGetFunnelAnalyticsQuery } from '@/store/api/analyticsApi';
import { useGetFunnelsQuery } from '@/store/api/funnelsApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, CheckCircle, CreditCard, TrendingUp } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const funnelId = searchParams.get('funnel');

  const { data: userAnalytics, isLoading: userLoading } = useGetUserAnalyticsQuery();
  const { data: funnelAnalytics, isLoading: funnelLoading } = useGetFunnelAnalyticsQuery(funnelId || '', {
    skip: !funnelId,
  });
  const { data: funnels } = useGetFunnelsQuery({ limit: 100 });

  const analytics = funnelId ? funnelAnalytics?.summary : userAnalytics?.summary;
  const isLoading = funnelId ? funnelLoading : userLoading;

  const stats = [
    { icon: Users, label: 'Начали', value: analytics?.totalStarted || 0 },
    { icon: CheckCircle, label: 'Завершили', value: (analytics as { completed?: number })?.completed || (analytics as { totalCompleted?: number })?.totalCompleted || 0 },
    { icon: CreditCard, label: 'Оплатили', value: (analytics as { paid?: number })?.paid || (analytics as { totalPaid?: number })?.totalPaid || 0 },
    { icon: TrendingUp, label: 'Доход', value: formatPrice(analytics?.totalRevenue || 0) },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Аналитика</h1>

      {funnels && funnels.data.length > 0 && (
        <Tabs defaultValue={funnelId || 'all'} className="w-full">
          <TabsList className="w-full overflow-x-auto">
            <TabsTrigger value="all" className="flex-shrink-0">
              Все
            </TabsTrigger>
            {funnels.data.slice(0, 5).map(f => (
              <TabsTrigger key={f.id} value={f.id} className="flex-shrink-0">
                {f.name.slice(0, 10)}...
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="grid grid-cols-2 gap-3">
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <stat.icon className="w-4 h-4" />
                <span className="text-xs">{stat.label}</span>
              </div>
              {isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{stat.value}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {funnelId && funnelAnalytics && (
        <>
          {funnelAnalytics.summary.conversionToPaid && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Конверсия в оплату</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{funnelAnalytics.summary.conversionToPaid}</p>
              </CardContent>
            </Card>
          )}

          {funnelAnalytics.recentSessions && funnelAnalytics.recentSessions.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Последние сессии</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {funnelAnalytics.recentSessions.map(session => (
                    <div key={session.id} className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <div>
                        <p className="font-medium text-sm">{session.visitorName || 'Гость'}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(session.startedAt)}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          session.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-700'
                            : session.status === 'PAID'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {session.status === 'COMPLETED' ? 'Завершен' : session.status === 'PAID' ? 'Оплачен' : 'В процессе'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!funnelId && !isLoading && !analytics && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>Нет данных для отображения</p>
            <p className="text-sm mt-2">Создайте и опубликуйте воронку, чтобы начать собирать статистику</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
