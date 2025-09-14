import { useState, useEffect } from 'react';
import { Settings, Activity, Database, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { DataTable, Column } from '@/components/admin/DataTable';
import { useToast } from '@/hooks/use-toast';
import { getAuditLogs, getAdminSettings, updateAdminSettings } from '@/lib/admin';
import { AuditLog, AdminSettings } from '@/types/admin';
import { formatDistanceToNow } from 'date-fns';

export default function AdminSystem() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      setSettings(getAdminSettings());
      setAuditLogs(getAuditLogs());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load system data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      await updateAdminSettings(settings);
      toast({
        title: "Success",
        description: "Settings updated successfully"
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const auditColumns: Column<AuditLog>[] = [
    {
      key: 'action',
      label: 'Action',
      render: (log) => (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <span className="font-medium">{log.action.replace('_', ' ')}</span>
        </div>
      ),
      width: '150px'
    },
    {
      key: 'actorName',
      label: 'Actor',
      width: '120px'
    },
    {
      key: 'target',
      label: 'Target',
      render: (log) => log.target ? (
        <div>
          <span className="capitalize">{log.target.type}</span>
          {log.target.name && (
            <div className="text-sm text-muted-foreground">{log.target.name}</div>
          )}
        </div>
      ) : '-',
      width: '150px'
    },
    {
      key: 'createdAt',
      label: 'Time',
      render: (log) => formatDistanceToNow(new Date(log.createdAt), { addSuffix: true }),
      width: '120px'
    },
    {
      key: 'metadata',
      label: 'Details',
      render: (log) => log.metadata ? (
        <div className="text-sm text-muted-foreground">
          {Object.entries(log.metadata).map(([key, value]) => (
            <div key={key}>
              {key}: {String(value)}
            </div>
          ))}
        </div>
      ) : '-',
      width: '200px'
    }
  ];

  if (loading || !settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">System Management</h1>
        <p className="text-muted-foreground mt-1">
          Configure system settings and monitor activity
        </p>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Moderation Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Moderation Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Moderation</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically flag suspicious content
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableAutoModeration}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, enableAutoModeration: checked })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="autoFlagThreshold">Auto Flag Threshold</Label>
                  <Input
                    id="autoFlagThreshold"
                    type="number"
                    value={settings.autoFlagThreshold}
                    onChange={(e) => 
                      setSettings({ ...settings, autoFlagThreshold: parseInt(e.target.value) })
                    }
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Number of reports before auto-flagging content
                  </p>
                </div>

                <div>
                  <Label htmlFor="maxPostsPerDay">Max Posts per Day</Label>
                  <Input
                    id="maxPostsPerDay"
                    type="number"
                    value={settings.maxPostsPerDay}
                    onChange={(e) => 
                      setSettings({ ...settings, maxPostsPerDay: parseInt(e.target.value) })
                    }
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Content Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maxImageSize">Max Image Size (MB)</Label>
                  <Input
                    id="maxImageSize"
                    type="number"
                    value={Math.round(settings.maxImageSize / 1024 / 1024)}
                    onChange={(e) => 
                      setSettings({ 
                        ...settings, 
                        maxImageSize: parseInt(e.target.value) * 1024 * 1024 
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="wordBlacklist">Word Blacklist</Label>
                  <Textarea
                    id="wordBlacklist"
                    value={settings.wordBlacklist.join('\n')}
                    onChange={(e) => 
                      setSettings({ 
                        ...settings, 
                        wordBlacklist: e.target.value.split('\n').filter(word => word.trim()) 
                      })
                    }
                    placeholder="Enter blocked words, one per line"
                    className="mt-1"
                    rows={6}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Words that will be automatically flagged in content
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={auditLogs}
                columns={auditColumns}
                loading={false}
                emptyMessage="No audit logs found"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>Connected</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  All database connections are healthy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  System Load
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span>Moderate</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  CPU: 45% | Memory: 60%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Error Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>0.02%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Error rate is within normal range
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}