import { useState, useEffect } from 'react';
import { Flag, User, FileText, MessageCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { DataTable, Column } from '@/components/admin/DataTable';
import { useToast } from '@/hooks/use-toast';
import { getReports, assignReport, resolveReport } from '@/lib/admin';
import { Report } from '@/types/admin';
import { formatDistanceToNow } from 'date-fns';

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('open');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadReports();
  }, [activeTab]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = getReports(activeTab === 'all' ? undefined : activeTab);
      setReports(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reports",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (reportId: string) => {
    try {
      await assignReport(reportId, 'admin');
      toast({
        title: "Success",
        description: "Report assigned successfully"
      });
      loadReports();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign report",
        variant: "destructive"
      });
    }
  };

  const handleResolve = async (reportId: string, resolution: 'dismissed' | 'action_taken') => {
    try {
      await resolveReport(reportId, resolution, resolutionNote);
      toast({
        title: "Success",
        description: "Report resolved successfully"
      });
      setSelectedReport(null);
      setResolutionNote('');
      loadReports();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve report",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in_review': return 'secondary';
      case 'resolved': return 'default';
      default: return 'outline';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getTargetIcon = (type: string) => {
    switch (type) {
      case 'post': return FileText;
      case 'comment': return MessageCircle;
      case 'user': return User;
      default: return Flag;
    }
  };

  const columns: Column<Report>[] = [
    {
      key: 'target',
      label: 'Target',
      render: (report) => {
        const Icon = getTargetIcon(report.target.type);
        return (
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <span className="capitalize">{report.target.type}</span>
          </div>
        );
      },
      width: '100px'
    },
    {
      key: 'reason',
      label: 'Reason',
      render: (report) => (
        <div>
          <div className="font-medium">{report.reason}</div>
          {report.description && (
            <div className="text-sm text-muted-foreground line-clamp-1">
              {report.description}
            </div>
          )}
        </div>
      ),
      width: '200px'
    },
    {
      key: 'reporterName',
      label: 'Reporter',
      width: '150px'
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (report) => (
        <Badge variant={getPriorityBadgeVariant(report.priority)}>
          {report.priority}
        </Badge>
      ),
      width: '100px'
    },
    {
      key: 'status',
      label: 'Status',
      render: (report) => (
        <Badge variant={getStatusBadgeVariant(report.status)}>
          {report.status}
        </Badge>
      ),
      width: '100px'
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (report) => formatDistanceToNow(new Date(report.createdAt), { addSuffix: true }),
      width: '120px'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (report) => (
        <div className="flex gap-1">
          {report.status === 'open' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAssign(report.id)}
            >
              Assign
            </Button>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="default"
                onClick={() => setSelectedReport(report)}
              >
                Resolve
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      ),
      width: '150px'
    }
  ];

  const filteredReports = reports.filter(report => {
    if (activeTab === 'all') return true;
    return report.status === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Reports Management</h1>
        <p className="text-muted-foreground mt-1">
          Review and resolve user reports
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Open Reports</p>
                <p className="text-2xl font-bold">{reports.filter(r => r.status === 'open').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">In Review</p>
                <p className="text-2xl font-bold">{reports.filter(r => r.status === 'in_review').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Resolved</p>
                <p className="text-2xl font-bold">{reports.filter(r => r.status === 'resolved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">High Priority</p>
                <p className="text-2xl font-bold">{reports.filter(r => r.priority === 'high').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in_review">In Review</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="all">All Reports</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <DataTable
            data={filteredReports}
            columns={columns}
            loading={loading}
            emptyMessage="No reports found"
            onRowClick={setSelectedReport}
          />
        </TabsContent>
      </Tabs>

      {/* Resolve Report Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
            <DialogDescription>
              Review and resolve this report
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Target Type</label>
                  <p className="text-sm text-muted-foreground capitalize">{selectedReport.target.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Reporter</label>
                  <p className="text-sm text-muted-foreground">{selectedReport.reporterName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Reason</label>
                  <p className="text-sm text-muted-foreground">{selectedReport.reason}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Badge variant={getPriorityBadgeVariant(selectedReport.priority)}>
                    {selectedReport.priority}
                  </Badge>
                </div>
              </div>
              
              {selectedReport.description && (
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Resolution Note</label>
                <Textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Provide details about how this report was resolved..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleResolve(selectedReport.id, 'dismissed')}
                >
                  Dismiss Report
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => handleResolve(selectedReport.id, 'action_taken')}
                >
                  Resolve with Action
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}