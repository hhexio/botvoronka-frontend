'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  className?: string;
  delay?: number;
}

export function StatCard({ icon: Icon, label, value, trend, className, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-card p-4',
        'hover:border-primary/30 transition-colors duration-200',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />

      <div className="relative">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Icon className="w-4 h-4" />
          <span className="text-xs font-medium">{label}</span>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold tracking-tight">{value}</span>
          {trend && (
            <span className={cn('text-xs font-medium mb-1', trend.isPositive ? 'text-green-500' : 'text-red-500')}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
