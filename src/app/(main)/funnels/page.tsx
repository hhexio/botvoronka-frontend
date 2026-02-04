'use client';

import Link from 'next/link';
import { useGetFunnelsQuery } from '@/store/api/funnelsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Layers } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function FunnelsPage() {
  const { data, isLoading } = useGetFunnelsQuery({ limit: 20 });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Воронки</h1>
        <Button asChild size="sm">
          <Link href="/funnels/new">
            <Plus className="w-4 h-4 mr-1" /> Создать
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Layers className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-medium mb-2">Нет воронок</h3>
            <Button asChild>
              <Link href="/funnels/new">
                <Plus className="w-4 h-4 mr-2" /> Создать воронку
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {data?.data.map(funnel => (
            <Link key={funnel.id} href={`/funnels/${funnel.id}`}>
              <Card className="hover:bg-gray-50 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{funnel.name}</h3>
                      {funnel.description && (
                        <p className="text-sm text-muted-foreground truncate">{funnel.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{funnel._count?.nodes || 0} шагов</span>
                        <span>•</span>
                        <span>{formatDate(funnel.createdAt)}</span>
                      </div>
                    </div>
                    <Badge variant={funnel.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {funnel.status === 'ACTIVE' ? 'Активна' : funnel.status === 'DRAFT' ? 'Черновик' : 'Пауза'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
