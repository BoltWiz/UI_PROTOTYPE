import { useEffect, useState } from 'react';
import { Users, FileText, Flag, Activity, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSystemStats, getModerationItems, getReports } from '@/lib/admin';
import { SystemStats } from '@/types/admin';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [recentItems, setRecentItems] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      setStats(getSystemStats());
      const pendingItems = getModerationItems('pending').slice(0, 5);
      const openReports = getReports('open').slice(0, 3);
      setRecentItems([...pendingItems, ...openReports]);
    };

    loadData();
  }, []);

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          System overview and management
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change={stats.newUsersToday}
          changeLabel="today"
          icon={Users}
          gradient="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20"
        />
        
        <StatCard
          title="Active Users (24h)"
          value={stats.activeUsers24h}
          icon={Activity}
          gradient="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20"
        />
        
        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          change={stats.postsToday}
          changeLabel="today"
          icon={FileText}
          gradient="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20"
        />
        
        <StatCard
          title="Pending Moderation"
          value={stats.pendingModeration}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20"
        />
        
        <StatCard
          title="Open Reports"
          value={stats.openReports}
          change={stats.reportsToday}
          changeLabel="today"
          icon={Flag}
          gradient="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Growth (7 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.usersByDay}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value) => [value, 'New Users']}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Posts Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Posts Growth (7 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.postsByDay}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value) => [value, 'New Posts']}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-2))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Queue</CardTitle>
        </CardHeader>
        <CardContent>
          {recentItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No pending items</p>
          ) : (
            <div className="space-y-3">
              {recentItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={item.state ? "secondary" : "destructive"}>
                      {item.state || item.status}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">
                        {item.content || item.reason}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}