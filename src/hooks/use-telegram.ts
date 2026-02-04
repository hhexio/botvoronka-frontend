'use client';

import { useEffect, useState } from 'react';
import { initTelegramApp, getTelegramUser, getTelegramInitData, haptic } from '@/lib/telegram';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export function useTelegram() {
  const [isReady, setIsReady] = useState(false);
  const [isTelegram, setIsTelegram] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [initData, setInitData] = useState<string | null>(null);

  useEffect(() => {
    const inTg = initTelegramApp();
    setIsTelegram(inTg);

    if (inTg) {
      setUser(getTelegramUser() as TelegramUser | null);
      setInitData(getTelegramInitData());
    }

    setIsReady(true);
  }, []);

  return { isReady, isTelegram, user, initData, haptic };
}
