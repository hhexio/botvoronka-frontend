import { Button } from '@/shared/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">BotVoronka</h1>
        <p className="text-gray-600 mb-6">Telegram Sales Funnel Builder</p>
        <div className="flex gap-3 justify-center">
          <Button>Создать воронку</Button>
          <Button variant="outline">Подробнее</Button>
        </div>
      </div>
    </main>
  );
}
