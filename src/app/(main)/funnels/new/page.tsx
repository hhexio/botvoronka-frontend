'use client';

import { useRouter } from 'next/navigation';
import { useGetTemplatesQuery, useCreateFromTemplateMutation } from '@/store/api/funnelsApi';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTelegram } from '@/hooks/use-telegram';
import { MessageSquare, Calendar, Gift, FileText, Loader2 } from 'lucide-react';

const ICONS: Record<string, typeof MessageSquare> = {
  course: MessageSquare,
  consultation: Calendar,
  leadmagnet: Gift,
  empty: FileText,
};

export default function NewFunnelPage() {
  const router = useRouter();
  const { haptic } = useTelegram();
  const { data: templates, isLoading } = useGetTemplatesQuery();
  const [create, { isLoading: isCreating }] = useCreateFromTemplateMutation();

  const handleSelect = async (templateId: string) => {
    haptic('light');
    try {
      const funnel = await create({ templateId }).unwrap();
      haptic('success');
      router.push(`/funnels/${funnel.id}`);
    } catch {
      haptic('error');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Выберите шаблон</h1>
        <div className="grid gap-3">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Новая воронка</h1>
        <p className="text-sm text-muted-foreground">Выберите шаблон</p>
      </div>

      <div className="grid gap-3">
        {templates?.map(template => {
          const Icon = ICONS[template.id] || FileText;
          return (
            <Card
              key={template.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSelect(template.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{template.nodesCount} шагов</p>
                  </div>
                  {isCreating && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
