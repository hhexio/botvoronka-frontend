'use client';

import { useGetSubscriptionQuery, useSubscribeMutation } from '@/store/api/billingApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTelegram } from '@/hooks/use-telegram';
import { Check, Loader2, Zap } from 'lucide-react';

const PLANS = [
  {
    id: 'FREE' as const,
    name: 'Бесплатный',
    price: 0,
    features: ['1 воронка', '100 лидов/месяц', 'Базовая аналитика', 'Шаблоны воронок'],
  },
  {
    id: 'PRO' as const,
    name: 'PRO',
    price: 990,
    features: ['Безлимит воронок', 'Безлимит лидов', 'Расширенная аналитика', 'Приоритетная поддержка', 'Интеграции'],
  },
];

export default function BillingPage() {
  const { haptic } = useTelegram();
  const { data: subscription, isLoading } = useGetSubscriptionQuery();
  const [subscribe, { isLoading: isSubscribing }] = useSubscribeMutation();

  const handleSubscribe = async (plan: 'FREE' | 'PRO') => {
    haptic('light');
    try {
      const result = await subscribe({ plan }).unwrap();
      if (result.paymentUrl) {
        window.open(result.paymentUrl, '_blank');
      }
      haptic('success');
    } catch {
      haptic('error');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Тарифы</h1>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Тарифы</h1>

      {subscription && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Текущий тариф</p>
                <p className="font-bold text-lg">{subscription.plan === 'PRO' ? 'PRO' : 'Бесплатный'}</p>
              </div>
              <Badge variant={subscription.plan === 'PRO' ? 'default' : 'secondary'}>{subscription.status}</Badge>
            </div>
            {subscription.limits && (
              <div className="mt-3 text-sm text-muted-foreground">
                <p>
                  Воронок: {subscription.limits.maxFunnels === -1 ? 'Безлимит' : subscription.limits.maxFunnels}
                </p>
                <p>
                  Лидов/мес:{' '}
                  {subscription.limits.maxLeadsPerMonth === -1 ? 'Безлимит' : subscription.limits.maxLeadsPerMonth}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {PLANS.map(plan => {
          const isCurrent = subscription?.plan === plan.id;
          return (
            <Card key={plan.id} className={isCurrent ? 'border-primary' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {plan.id === 'PRO' && <Zap className="w-5 h-5 text-yellow-500" />}
                    {plan.name}
                  </CardTitle>
                  {isCurrent && <Badge>Текущий</Badge>}
                </div>
                <CardDescription>
                  {plan.price === 0 ? (
                    'Бесплатно'
                  ) : (
                    <>
                      <span className="text-2xl font-bold text-foreground">{plan.price} ₽</span>
                      <span className="text-muted-foreground">/месяц</span>
                    </>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {!isCurrent && (
                  <Button
                    className="w-full"
                    variant={plan.id === 'PRO' ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isSubscribing}
                  >
                    {isSubscribing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : plan.id === 'PRO' ? (
                      'Перейти на PRO'
                    ) : (
                      'Выбрать'
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
