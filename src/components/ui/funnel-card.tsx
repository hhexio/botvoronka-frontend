'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Layers } from 'lucide-react';
import type { Funnel } from '@/types';

interface FunnelCardProps {
  funnel: Funnel;
  index?: number;
}

const statusConfig = {
  ACTIVE: { label: 'Активна', dot: 'bg-green-500' },
  DRAFT: { label: 'Черновик', dot: 'bg-yellow-500' },
  PAUSED: { label: 'Пауза', dot: 'bg-gray-400' },
};

export function FunnelCard({ funnel, index = 0 }: FunnelCardProps) {
  const status = statusConfig[funnel.status] || statusConfig.DRAFT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/funnels/${funnel.id}`}>
        <div className="group relative rounded-xl border bg-card p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
          {/* Status */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${status.dot}`} />
            <span className="text-xs text-muted-foreground">{status.label}</span>
          </div>

          {/* Content */}
          <div className="pr-20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                  {funnel.name}
                </h3>
                {funnel.description && (
                  <p className="text-sm text-muted-foreground truncate">{funnel.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3 ml-13">
              <span>{funnel._count?.nodes || 0} шагов</span>
              <span>•</span>
              <span>{formatDate(funnel.createdAt)}</span>
            </div>
          </div>

          {/* Hover gradient */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}
