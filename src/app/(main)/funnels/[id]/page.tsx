'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetFunnelQuery, usePublishFunnelMutation, useDeleteFunnelMutation } from '@/store/api/funnelsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTelegram } from '@/hooks/use-telegram';
import { ArrowLeft, Play, Trash2, Copy, ExternalLink, Loader2, BarChart3 } from 'lucide-react';

const NODE_LABELS: Record<string, string> = {
  MESSAGE: 'Сообщение',
  BUTTON: 'Кнопки',
  DELAY: 'Задержка',
  PAYMENT: 'Оплата',
  CONDITION: 'Условие',
};

export default function FunnelPage() {
  const params = useParams();
  const router = useRouter();
  const { haptic } = useTelegram();
  const funnelId = params.id as string;

  const [showDelete, setShowDelete] = useState(false);
  const [botLink, setBotLink] = useState<string | null>(null);

  const { data: funnel, isLoading } = useGetFunnelQuery(funnelId);
  const [publish, { isLoading: isPublishing }] = usePublishFunnelMutation();
  const [deleteFunnel, { isLoading: isDeleting }] = useDeleteFunnelMutation();

  const handlePublish = async () => {
    haptic('light');
    try {
      const result = await publish(funnelId).unwrap();
      setBotLink(result.botLink);
      haptic('success');
    } catch {
      haptic('error');
    }
  };

  const handleDelete = async () => {
    haptic('light');
    try {
      await deleteFunnel(funnelId).unwrap();
      haptic('success');
      router.replace('/funnels');
    } catch {
      haptic('error');
    }
  };

  const copyLink = () => {
    if (botLink) {
      navigator.clipboard.writeText(botLink);
      haptic('light');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!funnel) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Воронка не найдена</p>
        <Button asChild className="mt-4">
          <Link href="/funnels">К списку</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/funnels">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="font-bold truncate">{funnel.name}</h1>
          <Badge variant={funnel.status === 'ACTIVE' ? 'default' : 'secondary'}>
            {funnel.status === 'ACTIVE' ? 'Активна' : 'Черновик'}
          </Badge>
        </div>
      </div>

      <div className="flex gap-2">
        {funnel.status !== 'ACTIVE' ? (
          <Button
            className="flex-1"
            onClick={handlePublish}
            disabled={isPublishing || (funnel.nodes?.length || 0) === 0}
          >
            {isPublishing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            Опубликовать
          </Button>
        ) : (
          <Button asChild className="flex-1">
            <Link href={`/analytics?funnel=${funnelId}`}>
              <BarChart3 className="w-4 h-4 mr-2" /> Аналитика
            </Link>
          </Button>
        )}
      </div>

      {(funnel.status === 'ACTIVE' || botLink) && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-green-800 mb-2">Ссылка на бота</p>
            <div className="flex gap-2">
              <code className="flex-1 text-xs bg-white px-3 py-2 rounded border truncate">
                {botLink || `https://t.me/BotVoronkaBot?start=${funnelId}`}
              </code>
              <Button size="icon" variant="outline" onClick={copyLink}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline" asChild>
                <a href={botLink || `https://t.me/BotVoronkaBot?start=${funnelId}`} target="_blank" rel="noopener">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">Шаги воронки ({funnel.nodes?.length || 0})</h3>
          {funnel.nodes?.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Нет шагов</p>
          ) : (
            <div className="space-y-2">
              {funnel.nodes?.map((node, i) => (
                <div key={node.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{node.name}</p>
                    <p className="text-xs text-muted-foreground">{NODE_LABELS[node.type] || node.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full text-red-600" onClick={() => setShowDelete(true)}>
        <Trash2 className="w-4 h-4 mr-2" /> Удалить воронку
      </Button>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить воронку?</AlertDialogTitle>
            <AlertDialogDescription>Это действие нельзя отменить.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600" disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Удалить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
