'use client';

import { useAppSelector, useAppDispatch, logout } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTelegram } from '@/hooks/use-telegram';
import { useRouter } from 'next/navigation';
import { LogOut, User, HelpCircle, MessageCircle, Shield } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { haptic } = useTelegram();
  const { user } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    haptic('light');
    dispatch(logout());
    router.replace('/login');
  };

  const menuItems = [
    { icon: HelpCircle, label: 'Помощь', href: 'https://t.me/BotVoronkaSupport' },
    { icon: MessageCircle, label: 'Связаться с нами', href: 'https://t.me/BotVoronkaSupport' },
    { icon: Shield, label: 'Политика конфиденциальности', href: '/privacy' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Настройки</h1>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-5 h-5" />
            Профиль
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-16 h-16 rounded-full" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
            )}
            <div>
              <p className="font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              {user?.username && <p className="text-sm text-muted-foreground">@{user.username}</p>}
              <p className="text-xs text-muted-foreground mt-1">ID: {user?.telegramId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {menuItems.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-4 hover:bg-gray-50 ${i !== menuItems.length - 1 ? 'border-b' : ''}`}
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span>{item.label}</span>
            </a>
          ))}
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full text-red-600" onClick={handleLogout}>
        <LogOut className="w-4 h-4 mr-2" />
        Выйти
      </Button>

      <p className="text-center text-xs text-muted-foreground">BotVoronka v1.0.0</p>
    </div>
  );
}
