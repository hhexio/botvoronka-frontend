'use client';

import Link from 'next/link';
import { useGetFunnelsQuery } from '@/store/api/funnelsApi';
import { useGetUserAnalyticsQuery } from '@/store/api/analyticsApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Layers, Users, CreditCard, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function DashboardPage() {
  const { data: funnels, isLoading: funnelsLoading } = useGetFunnelsQuery({ limit: 3 });
  const { data: analytics, isLoading: analyticsLoading } = useGetUserAnalyticsQuery();

  return (
    <div className="space-y-6">
      <Button asChild className="w-full">
        <Link href="/funnels/new">
          <Plus className="w-4 h-4 mr-2" /> Создать воронку
        </Link>
      </Button>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Layers, label: 'Воронки', value: analytics?.summary?.totalFunnels || 0 },
          { icon: Users, label: 'Лиды', value: analytics?.summary?.totalStarted || 0 },
          { icon: CreditCard, label: 'Оплаты', value: analytics?.summary?.totalPaid || 0 },
          { icon: TrendingUp, label: 'Доход', value: formatPrice(analytics?.summary?.totalRevenue || 0) },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <stat.icon className="w-4 h-4" />
                <span className="text-xs">{stat.label}</span>
              </div>
              {analyticsLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{stat.value}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Последние воронки</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/funnels">Все</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {funnelsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : funnels?.data.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>У вас пока нет воронок</p>
            </div>
          ) : (
            <div className="space-y-3">
              {funnels?.data.map(funnel => (
                <Link
                  key={funnel.id}
                  href={`/funnels/${funnel.id}`}
                  className="block p-3 rounded-lg border hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{funnel.name}</p>
                      <p className="text-sm text-muted-foreground">{funnel._count?.nodes || 0} шагов</p>
                    </div>
                    <Badge variant={funnel.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {funnel.status === 'ACTIVE' ? 'Активна' : 'Черновик'}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
