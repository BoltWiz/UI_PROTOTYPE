import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  gradient: string;
}

export function StatCard({ title, value, change, changeLabel, icon: Icon, gradient }: StatCardProps) {
  return (
    <Card className={`${gradient} border-0`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {title}
          </CardTitle>
          <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {value.toLocaleString()}
        </div>
        {change !== undefined && changeLabel && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {change > 0 ? '+' : ''}{change} {changeLabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
}