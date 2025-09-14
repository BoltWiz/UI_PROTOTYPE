import { TrendingUp, Star, Palette, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useInsights } from '@/hooks/useFavorites';
import { Style, Season } from '@/types/favorites';

const styleColors = {
  casual: '#3B82F6',
  formal: '#8B5CF6',
  sport: '#10B981',
  smart: '#F59E0B',
  street: '#EF4444'
};

const seasonColors = {
  spring: '#10B981',
  summer: '#F59E0B',
  fall: '#EF4444',
  winter: '#3B82F6'
};

export function Insights() {
  const { total, avgQuality, topStyle, mostWornSeason, styleDistribution, seasonDistribution, loading } = useInsights();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-24 mb-2" />
                <div className="h-8 bg-muted rounded w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const styleChartData = Object.entries(styleDistribution).map(([style, count]) => ({
    name: style,
    value: count,
    color: styleColors[style as Style]
  }));

  const seasonChartData = Object.entries(seasonDistribution).map(([season, count]) => ({
    name: season,
    value: count,
    fill: seasonColors[season as Season]
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Style Insights</h2>
          <p className="text-muted-foreground">
            Analyze your favorite outfit patterns and preferences
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-glow">
          Get AI Suggestions
        </Button>
      </div>

      {/* Stats Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          icon={<TrendingUp className="w-5 h-5" />}
          label="Total Favorites"
          value={total.toString()}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        
        <StatTile
          icon={<Star className="w-5 h-5" />}
          label="Avg Quality"
          value={`${avgQuality.toFixed(1)}%`}
          color="text-yellow-600"
          bgColor="bg-yellow-100"
        />
        
        <StatTile
          icon={<Palette className="w-5 h-5" />}
          label="Top Style"
          value={topStyle.charAt(0).toUpperCase() + topStyle.slice(1)}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        
        <StatTile
          icon={<Calendar className="w-5 h-5" />}
          label="Most Worn Season"
          value={mostWornSeason.charAt(0).toUpperCase() + mostWornSeason.slice(1)}
          color="text-green-600"
          bgColor="bg-green-100"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Style Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Style Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={styleChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {styleChartData.map((entry, index) => (
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
                              {data.value} outfit{data.value !== 1 ? 's' : ''}
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
            
            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              {styleChartData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm capitalize">{entry.name}</span>
                  <span className="text-xs text-muted-foreground">({entry.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Season Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Seasonal Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seasonChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium capitalize">{label}</p>
                            <p className="text-sm text-muted-foreground">
                              {payload[0].value} outfit{payload[0].value !== 1 ? 's' : ''}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}

function StatTile({ icon, label, value, color, bgColor }: StatTileProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <div className={color}>
              {icon}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}