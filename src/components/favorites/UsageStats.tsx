import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface UsageStatsProps {
  timesWorn: number;
  lastWorn?: string;
  weeklyWears: number[];
}

export function UsageStats({ timesWorn, lastWorn, weeklyWears }: UsageStatsProps) {
  // Convert weekly wears array to chart data
  const chartData = weeklyWears.map((wears, index) => ({
    week: `W${index + 1}`,
    wears
  }));

  const maxWears = Math.max(...weeklyWears);
  const totalRecentWears = weeklyWears.reduce((sum, wears) => sum + wears, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Usage Stats</span>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            {timesWorn} total
          </Badge>
        </div>
      </div>

      {/* Mini Sparkline Chart */}
      <div className="h-16 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorWears" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="wears"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#colorWears)"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg p-2 shadow-lg">
                      <p className="text-xs">
                        {label}: {payload[0].value} {payload[0].value === 1 ? 'wear' : 'wears'}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
        <div>
          <span className="font-medium text-foreground">{totalRecentWears}</span>
          <span className="ml-1">times last 8 weeks</span>
        </div>
        <div>
          {lastWorn ? (
            <>
              <span className="font-medium text-foreground">Last worn</span>
              <span className="ml-1">{formatDistanceToNow(new Date(lastWorn))} ago</span>
            </>
          ) : (
            <span className="text-muted-foreground">Never worn</span>
          )}
        </div>
      </div>
    </div>
  );
}