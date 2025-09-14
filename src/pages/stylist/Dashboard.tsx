import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FolderOpen, 
  PenTool, 
  Heart, 
  Eye, 
  MessageCircle,
  Plus,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

// Mock data
const statsData = {
  followers: 2500,
  collections: 12,
  tips: 28,
  postsThisWeek: 8,
  likes: 1240,
  comments: 340,
};

const viewsData = [
  { name: 'Mon', views: 120, interactions: 45 },
  { name: 'Tue', views: 190, interactions: 62 },
  { name: 'Wed', views: 300, interactions: 89 },
  { name: 'Thu', views: 280, interactions: 94 },
  { name: 'Fri', views: 450, interactions: 156 },
  { name: 'Sat', views: 520, interactions: 203 },
  { name: 'Sun', views: 380, interactions: 142 },
];

const contentPerformance = [
  { name: 'Color Guide', views: 890, likes: 234 },
  { name: 'Layering Tips', views: 650, likes: 189 },
  { name: 'Office Wear', views: 520, likes: 145 },
  { name: 'Date Night', views: 480, likes: 132 },
];

export default function StylistDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const StatCard = ({ title, value, icon: Icon, change }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {change && (
              <p className="text-xs text-green-600 mt-1">
                +{change}% from last week
              </p>
            )}
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/stylist/collections/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
          <Button variant="outline" onClick={() => navigate('/stylist/tips/new')}>
            <PenTool className="h-4 w-4 mr-2" />
            Write Tip
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Followers" value={statsData.followers} icon={Users} change={8} />
        <StatCard title="Collections" value={statsData.collections} icon={FolderOpen} />
        <StatCard title="Tips Published" value={statsData.tips} icon={PenTool} />
        <StatCard title="Posts This Week" value={statsData.postsThisWeek} icon={TrendingUp} change={15} />
        <StatCard title="Total Likes" value={statsData.likes} icon={Heart} change={12} />
        <StatCard title="Comments" value={statsData.comments} icon={MessageCircle} change={20} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Views & Interactions (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="interactions" stroke="hsl(var(--secondary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contentPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New collection "Winter Essentials" published</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge variant="outline">Collection</Badge>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Style tip "Color Matching 101" received 15 new likes</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
              <Badge variant="outline">Tip</Badge>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New consultation request from Sarah M.</p>
                <p className="text-xs text-muted-foreground">6 hours ago</p>
              </div>
              <Badge variant="outline">Request</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}