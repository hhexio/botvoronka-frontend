'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegram } from '@/hooks/use-telegram';
import { useTelegramLoginMutation } from '@/store/api/authApi';
import { useAppDispatch, useAppSelector, setCredentials } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isReady, isTelegram, initData, user } = useTelegram();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [login, { isLoading }] = useTelegramLoginMutation();
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isReady && isTelegram && initData && !tried && !isAuthenticated) {
      setTried(true);
      handleLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, isTelegram, initData, tried, isAuthenticated]);

  const handleLogin = async () => {
    if (!initData) return;
    try {
      const result = await login({ initData }).unwrap();
      dispatch(setCredentials(result));
      router.replace('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isTelegram) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Добро пожаловать!</CardTitle>
            <CardDescription>{user?.first_name}, входим...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : (
              <Button onClick={handleLogin}>Войти</Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/10 to-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="text-4xl mb-4">🤖</div>
          <CardTitle>BotVoronka</CardTitle>
          <CardDescription>Воронки продаж в Telegram</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-6">Откройте приложение через Telegram</p>
          <Button asChild className="w-full">
            <a href="https://t.me/BotVoronkaBot">Открыть в Telegram</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
