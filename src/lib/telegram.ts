'use client';

export function initTelegramApp() {
  if (typeof window === 'undefined') return false;

  const tg = (window as unknown as { Telegram?: { WebApp?: { ready: () => void; expand: () => void } } }).Telegram
    ?.WebApp;
  if (!tg) return false;

  tg.ready();
  tg.expand();

  return true;
}

export function getTelegramUser() {
  if (typeof window === 'undefined') return null;
  return (
    window as unknown as {
      Telegram?: { WebApp?: { initDataUnsafe?: { user?: unknown } } };
    }
  ).Telegram?.WebApp?.initDataUnsafe?.user || null;
}

export function getTelegramInitData(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    window as unknown as {
      Telegram?: { WebApp?: { initData?: string } };
    }
  ).Telegram?.WebApp?.initData || null;
}

export function haptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'error') {
  const tg = (
    window as unknown as {
      Telegram?: {
        WebApp?: {
          HapticFeedback?: {
            notificationOccurred: (type: string) => void;
            impactOccurred: (type: string) => void;
          };
        };
      };
    }
  ).Telegram?.WebApp;
  if (!tg?.HapticFeedback) return;

  if (type === 'success' || type === 'error') {
    tg.HapticFeedback.notificationOccurred(type);
  } else {
    tg.HapticFeedback.impactOccurred(type);
  }
}
