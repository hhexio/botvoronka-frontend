'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Layers, Zap, BarChart3, ChevronRight, X } from 'lucide-react';

const ONBOARDING_KEY = 'botvoronka_onboarding_complete';

const slides = [
  {
    icon: Layers,
    title: 'Создавайте воронки',
    description: 'Выбирайте готовые шаблоны или создавайте с нуля. Никакого кода — только простой визуальный редактор.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Zap,
    title: 'Автоматизируйте продажи',
    description: 'Ваш бот работает 24/7. Отправляет сообщения, принимает оплату и ведёт клиентов к покупке.',
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: BarChart3,
    title: 'Отслеживайте результаты',
    description: 'Аналитика в реальном времени. Видите конверсии, доход и узкие места воронки.',
    color: 'from-green-500 to-teal-600',
  },
];

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const isComplete = localStorage.getItem(ONBOARDING_KEY);
    if (!isComplete) {
      setIsOpen(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  if (!isOpen) return null;

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-md mx-4 bg-card rounded-2xl border shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          <button
            onClick={handleComplete}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 pt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="relative mx-auto mb-6 w-20 h-20">
                  <div className={`absolute inset-0 bg-gradient-to-br ${slide.color} rounded-2xl blur-xl opacity-50`} />
                  <div className={`relative w-full h-full bg-gradient-to-br ${slide.color} rounded-2xl flex items-center justify-center`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-3">{slide.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{slide.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="px-8 pb-8">
            <div className="flex justify-center gap-2 mb-6">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'w-6 bg-primary' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>

            <Button onClick={handleNext} className="w-full" size="lg">
              {currentSlide < slides.length - 1 ? (
                <>Далее <ChevronRight className="w-4 h-4 ml-1" /></>
              ) : (
                'Начать'
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
