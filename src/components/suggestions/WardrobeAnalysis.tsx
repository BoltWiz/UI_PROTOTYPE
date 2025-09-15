import { useState, useEffect } from 'react';
import { BarChart3, Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Item } from '@/types';
import { WardrobeGap } from '@/types/suggestions';
import { calculateWardrobeCompleteness } from '@/lib/suggestions';

interface WardrobeAnalysisProps {
  userItems: Item[];
  gaps: WardrobeGap[];
  onViewGap: (gap: WardrobeGap) => void;
}

export function WardrobeAnalysis({ userItems, gaps, onViewGap }: WardrobeAnalysisProps) {
  const [completenessScore, setCompletenessScore] = useState(0);

  useEffect(() => {
    const score = calculateWardrobeCompleteness(userItems);
    setCompletenessScore(score);
  }, [userItems]);

  // Prepare chart data
  const typeDistribution = userItems.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(typeDistribution).map(([type, count]) => ({
    name: type,
    value: count,
    color: getTypeColor(type)
  }));

  const occasionData = userItems.reduce((acc, item) => {
    item.occasions.forEach(occasion => {
      acc[occasion] = (acc[occasion] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const occasionChartData = Object.entries(occasionData).map(([occasion, count]) => ({
    name: occasion,
    count
  }));

  function getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      top: '#3B82F6',
      bottom: '#10B981',
      shoes: '#F59E0B',
      outer: '#8B5CF6',
      accessory: '#EF4444'
    };
    return colors[type] || '#6B7280';
  }

  const getCompletenessColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletenessMessage = (score: number) => {
    if (score >= 80) return 'Tủ đồ của bạn khá hoàn thiện!';
    if (score >= 60) return 'Tủ đồ cần bổ sung thêm một số item.';
    return 'Tủ đồ cần được mở rộng đáng kể.';
  };

  return (
    <div className="space-y-6">
      {/* Completeness Score */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Độ hoàn thiện tủ đồ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getCompletenessColor(completenessScore)}`}>
              {completenessScore}%
            </div>
            <p className="text-muted-foreground">{getCompletenessMessage(completenessScore)}</p>
          </div>
          
          <Progress value={completenessScore} className="h-3" />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold">{userItems.length}</div>
              <div className="text-xs text-muted-foreground">Tổng items</div>
            </div>
            <div>
              <div className="text-lg font-semibold">{gaps.length}</div>
              <div className="text-xs text-muted-foreground">Gaps phát hiện</div>
            </div>
            <div>
              <div className="text-lg font-semibold">
                {gaps.reduce((sum, gap) => sum + gap.missingItems.length, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Items gợi ý</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Phân bố theo loại
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: data.color }}
                              />
                              <span className="font-medium capitalize">{data.name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {data.value} item{data.value !== 1 ? 's' : ''}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Occasion Coverage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Phủ sóng theo dịp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occasionChartData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium capitalize">{label}</p>
                            <p className="text-sm text-muted-foreground">
                              {payload[0].value} item{payload[0].value !== 1 ? 's' : ''}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gaps Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Phân tích thiếu hụt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gaps.map((gap) => (
              <div key={gap.category} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{gap.category}</h4>
                  <p className="text-sm text-muted-foreground">{gap.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={gap.completionScore} className="h-1 flex-1 max-w-32" />
                    <span className="text-xs text-muted-foreground">{gap.completionScore}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {gap.missingItems.length} items
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewGap(gap)}
                  >
                    Xem
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}